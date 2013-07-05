angular.module(
    'buddies',
    ['users', 'request', 'mediator', 'persistent-set']
).run(function (Users, Request, Mediator, PersistentSet) {
    var readyDeferred = jQuery.Deferred(),
        watchedBuddiesSet = new PersistentSet('watchedBuddies'),
        buddiesColl = new (Backbone.Collection.extend({
            model: Backbone.Model.extend({
                idAttribute: 'id'
            }),
            comparator: function (buddie) {
                if (buddie.get('isFave')) {
                    return -1;
                } else {
                    return buddie.get('originalIndex') || 0;
                }
            }
        }))();

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
                'id'
            )).then(function (profiles) {
                profiles.forEach(function (profile) {
                    profile.set('isFave', true);
                });
                return profiles;
            });
        });
    }

    jQuery.when(
        getFavouriteUsers(),
        Users.getFriendsProfiles()
    ).then(function (favourites, friends) {
        buddiesColl.add(favourites);
        buddiesColl.add(friends);
        watchedBuddiesSet.toArray().forEach(function (uid) {
            var model = buddiesColl.get(uid);
            console.log(model, uid);
            if (model) {
                model.set('isWatched', true);
            }
        });
        readyDeferred.resolve();
    });

    Mediator.sub('buddies:data:get', function () {
        readyDeferred.then(function () {
            Mediator.pub('buddies:data', buddiesColl.toJSON());
        });
    });

    Mediator.sub('buddies:watch:toggle', function (uid) {
        console.log(uid, watchedBuddiesSet.contains(uid));
        if (watchedBuddiesSet.contains(uid)) {
            watchedBuddiesSet.remove(uid);
            buddiesColl.get(uid).unset('isWatched');
        } else {
            watchedBuddiesSet.add(uid);
            buddiesColl.get(uid).set('isWatched');
        }
        if (buddiesColl.get(uid).hasChanged()) {
            Mediator.pub('buddies:data', buddiesColl.toJSON());
        }
    });
});
