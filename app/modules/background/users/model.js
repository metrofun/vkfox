define([
    'backbone',
    'underscore',
    'request/request',
    'mediator/mediator'
], function (Backbone, _, request, Mediator) {
    var DROP_PROFILES_INTERVAL = 30000,
        USERS_GET_DEBOUNCE = 400;

    return Backbone.Model.extend({
        usersGetQueue: [],
        defaults: {
            users: new (Backbone.Collection.extend({
                model: Backbone.Model.extend({
                    idAttribute: 'id'
                })
            }))()
        },
        initialize: function () {
            var self = this;

            this.dropOldNonFriendsProfiles();
            Mediator.sub('users:friends:get', function () {
                self.getFriendsProfiles().done(function (friendsProfiles) {
                    Mediator.pub('users:friends', friendsProfiles);
                });
            });
        },
        getFriendsProfiles: function () {
            if (!this._friendsProfilesDeferr) {
                this._friendsProfilesDeferr = request.api({
                    code: 'return API.friends.get({ fields : "photo,sex,nickname,lists", order: "hints" })'
                }).then(function (response) {
                    if (response && response.length) {
                        response.forEach(function (friendData) {
                            friendData.isFriend = true;
                        });
                        this.get('users').add(response);
                    }
                    return response;
                }.bind(this));
            }

            return this._friendsProfilesDeferr;
        },
        // TODO problem when dropped between onGet and response
        dropOldNonFriendsProfiles: _.debounce(function () {
            this.get('users').remove(this.get('users').filter(function (model) {
                return !model.get('isFriend');
            }));
            this.dropOldNonFriendsProfiles();
        }, DROP_PROFILES_INTERVAL),
        processGetUsersQueue: _.debounce(function () {
            var newUids = _.chain(this.usersGetQueue).pluck('uids').flatten()
                .unique().difference(this.get('users').pluck('uid'));

            if (newUids.length) {
                request.api({
                    // TODO limit for uids.length
                    code: 'return API.users.get({uids: "' + newUids.join() + '", fields : "online, photo,sex,nickname,lists"})'
                }).done(function (response) {
                    if (response && response.length) {
                        this.get('users').add(response);
                        this._publishUids();
                    }
                }.bind(this));
            } else {
                this._publishUids();
            }
        }, USERS_GET_DEBOUNCE),
        _publishUids: function () {
            var data, queueItem;

            function getUid(uid) {
                return _.clone(this.get('users').get(Number(uid)));
            }

            while (this.usersGetQueue.length) {
                queueItem = this.usersGetQueue.pop();
                data = queueItem.uids.map(getUid, this);

                if (data.length === 1) {
                    queueItem.resolve(data[0]);
                } else {
                    queueItem.resolve(data);
                }
            }
        },
        /**
         * Returns profiles by ids
         * @param [Array<<Number>>|Number] uids Array of user's uds
         *
         * @returns {jQuery.Deferred} Returns promise that will be fulfilled with profiles
         */
        getProfilesById: function (uids) {
            return this.getFriendsProfiles().then(function () {
                var deferr = new jQuery.Deferred();

                this.usersGetQueue.push({
                    uids: uids,
                    deferr: deferr
                });
                this.processGetUsersQueue();
            });
        }
    });
});
