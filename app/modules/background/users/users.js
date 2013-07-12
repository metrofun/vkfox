angular.module('users', ['request']).factory('Users', function (Request) {
    var
    DROP_PROFILES_INTERVAL = 500,
    USERS_GET_DEBOUNCE = 400,

    inProgress = false,
    usersColl = new (Backbone.Collection.extend({
        model: Backbone.Model.extend({
            idAttribute: 'uid'
        })
    }))(),
    usersGetQueue = [],
    dropOldNonFriendsProfiles = _.debounce(function () {
        if (!inProgress) {
            usersColl.remove(usersColl.filter(function (model) {
                return !model.get('isFriend');
            }));
        }
        dropOldNonFriendsProfiles();
    }, DROP_PROFILES_INTERVAL),
    processGetUsersQueue = _.debounce(function () {
        var processedQueue = usersGetQueue,
            newUids = _.chain(processedQueue).pluck('uids').flatten()
                .unique().difference(usersColl.pluck('id')).value();

        // start new queue
        usersGetQueue = [];

        if (newUids.length) {
            inProgress = true;
            Request.api({
                // TODO limit for uids.length
                code: 'return API.users.get({uids: "' + newUids.join() + '", fields : "online, photo,sex,nickname,lists"})'
            }).then(function (response) {
                if (response && response.length) {
                    usersColl.add(response);
                    publishUids(processedQueue);
                    inProgress = false;
                }
            }.bind(this));
        } else {
            publishUids(processedQueue);
        }
    }, USERS_GET_DEBOUNCE),
    /**
     * Resolves items from provided queue
     *
     * @param [Array] queue
     */
    publishUids = function (queue) {
        var data, queueItem;

        function getProfileById(uid) {
            return _.clone(usersColl.get(Number(uid)));
        }

        while (queue.length) {
            queueItem = queue.pop();
            data = queueItem.uids.map(function (uid) {
                return getProfileById(uid).toJSON();
            });

            if (data.length === 1) {
                queueItem.deferred.resolve(data[0]);
            } else {
                queueItem.deferred.resolve(data);
            }
        }
    };

    dropOldNonFriendsProfiles();


    return {
        getFriendsProfiles: function () {
            if (!this._friendsProfilesDefer) {
                this._friendsProfilesDefer = Request.api({
                    code: 'return API.friends.get({ fields : "photo,sex,nickname,lists", order: "hints" })'
                }).then(function (response) {
                    if (response && response.length) {
                        response.forEach(function (friendData) {
                            friendData.isFriend = true;
                        });
                        usersColl.add(response);
                    }
                    return response;
                }.bind(this));
            }

            return this._friendsProfilesDefer;
        },
        /**
         * Returns profiles by ids
         * @param [Array<<Number>>|Number] uids Array of user's uds
         *
         * @returns {jQuery.Deferred} Returns promise that will be fulfilled with profiles
         */
        getProfilesById: function (uids) {
            return this.getFriendsProfiles().then(function () {
                var deferred = jQuery.Deferred();

                usersGetQueue.push({
                    uids: uids,
                    deferred: deferred
                });
                processGetUsersQueue();
                return deferred;
            });
        }
    };
});
