angular.module('buddies', [
    'users',
    'request',
    'mediator',
    'persistent-set',
    'profiles-collection',
    'notifications'
]).run(function (
    Users,
    Request,
    Mediator,
    PersistentSet,
    ProfilesCollection,
    NotificationsQueue,
    $filter,
    NOTIFICATIONS_BUDDIES
) {
    var readyDeferred,
        watchedBuddiesSet = new PersistentSet('watchedBuddies'),
        buddiesColl = new (ProfilesCollection.extend({
            model: Backbone.Model.extend({
                idAttribute: 'uid',
                // Automatically set last activity time
                // for all watched items
                initialize: function () {
                    this.on('change:isWatched', function (model) {
                        if (model.get('isWatched')) {
                            Request.api({
                                code: 'return API.messages.getLastActivity({user_id: '
                                    + model.get('uid') + '})'
                            }).then(function (response) {
                                model
                                    .set('online', response.online)
                                    .set('lastActivityTime', response.time * 1000);

                                buddiesColl.sort();
                            });
                        } else {
                            model.unset('lastActivityTime');
                        }
                        buddiesColl.sort();
                    });
                }
            }),
            comparator: function (buddie) {
                if (buddie.get('isWatched')) {
                    if (buddie.get('lastActivityTime')) {
                        return -buddie.get('lastActivityTime');
                    } else {
                        return -2;
                    }
                } else if (buddie.get('isFave')) {
                    return -1;
                } else {
                    return buddie.get('originalIndex') || 0;
                }
            }
        }))(),
        publishData = _.debounce(function () {
            Mediator.pub('buddies:data', buddiesColl.toJSON());
        }, 0);


    /**
     * Initialize all state
     */
    function initialize() {
        if (!readyDeferred || readyDeferred.state() === 'resolved') {
            if (readyDeferred) {
                readyDeferred.reject();
            }
            readyDeferred = jQuery.Deferred();
        }
        readyDeferred.then(publishData);
    }
    initialize();

    /**
     * After changing and unchanging any field of buddie,
     * we need to place it to original place in list,
     * So we add index property.
     * Runs once.
     */
    function saveOriginalBuddiesOrder() {
        var length = buddiesColl.length;

        if (length && !buddiesColl.at(length - 1).get('originalIndex')) {
            buddiesColl.forEach(function (buddie, i) {
                buddie.set('originalIndex', i);
            });
        }
    }

    /**
     * Returns profiles from bookmarks,
     * and sets "isFave=true" on profile object
     *
     * @returns [jQuery.Deferred]
     */
    function getFavouriteUsers() {
        return Request.api({
            code: 'return API.fave.getUsers()'
        }).then(function (response) {
            return Users.getProfilesById(
                _.pluck(response.slice(1),
                'uid'
            )).then(function (profiles) {
                profiles.forEach(function (profile) {
                    profile.isFave = true;
                });
                return profiles;
            });
        });
    }

    /**
     * Extends buddiesColl with information
     * about watched persons
     */
    function setWatchedBuddies() {
        watchedBuddiesSet.toArray().forEach(function (uid) {
            var model = buddiesColl.get(uid);
            if (model) {
                model.set('isWatched', true);
            }
        });
    }

    // entry point
    Mediator.sub('auth:success', function () {
        initialize();

        jQuery.when(
            Users.getFriendsProfiles(),
            getFavouriteUsers()
        ).then(function (friends, favourites) {
            buddiesColl.reset([].concat(favourites, friends));

            saveOriginalBuddiesOrder();
            setWatchedBuddies();

            readyDeferred.resolve();
        });
    });

    Mediator.sub('buddies:data:get', function () {
        readyDeferred.then(publishData);
    });

    readyDeferred.then(function () {
        buddiesColl.on('change', function (model) {
            var profile = model.toJSON(), gender;

            if (profile.isWatched && model.changed.hasOwnProperty('online')) {
                model.set({
                    'lastActivityTime': Date.now()
                }, {silent: true});
                gender = profile.sex === 1 ? 'female':'male';

                // Notify about watched buddies
                NotificationsQueue.push({
                    type: NOTIFICATIONS_BUDDIES,
                    title: [
                        $filter('name')(profile),
                        $filter('i18n')(
                            profile.online ? 'is online':'went offline',
                            {GENDER: gender}
                        )
                    ].join(' '),
                    image: model.get('photo'),
                    noBadge: true
                });

                buddiesColl.sort();
            }
            publishData();
        });
    });

    Mediator.sub('buddies:watch:toggle', function (uid) {
        if (watchedBuddiesSet.contains(uid)) {
            watchedBuddiesSet.remove(uid);
            buddiesColl.get(uid).unset('isWatched');
        } else {
            watchedBuddiesSet.add(uid);
            buddiesColl.get(uid).set('isWatched', true);
        }
    });
});
