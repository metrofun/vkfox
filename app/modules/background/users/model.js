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
                    idAttribute: 'uid'
                })
            }))()
        },
        initialize: function () {
            this.dropOldNonFriendsProfiles();
            this.getFriends();
            Mediator.sub('users:get', this.onGet.bind(this));
            Mediator.sub('users:getFriends', this.onGetFriends.bind(this));
        },
        getFriends: function () {
            request.api({
                code: 'return API.friends.get({ fields : "photo,sex,nickname,lists" })'
            }).done(function (response) {
                if (response && response.length) {
                    response.forEach(function (friendData) {
                        friendData.isFriend = true;
                    });
                    this.get('users').add(response);
                }
            }.bind(this));
        },
        // TODO problem when dropped between onGet and response
        dropOldNonFriendsProfiles: _.debounce(function () {
            this.get('users').remove(this.get('users').filter(function (model) {
                return !model.get('isFriend');
            }));
            this.dropOldNonFriendsProfiles();
        }, DROP_PROFILES_INTERVAL),
        onGetFriends: function () {
            Mediator.pub('users:friends', this.get('users').filter(function (model) {
                return model.get('isFriend');
            }).toJSON());
        },
        // TODO bulk several requests to users.get
        onGet: function (uids) {
            this.usersGetQueue.push(uids);
            this.processGetUsersQueue();
        },
        processGetUsersQueue: _.debounce(function () {
            var newUids = _.difference(_.unique(_.flatten(this.usersGetQueue)), this.get('users').pluck('uid'));

            if (newUids.length) {
                request.api({
                    // TODO limit for uids.length
                    code: 'return API.users.get({uids: "' + newUids.join() + '", fields : "online, photo,sex,nickname,lists"})'
                }).done(function (response) {
                    if (response && response.length) {
                        this.get('users').add(response);
                        this.publishUids();
                    }
                }.bind(this));
            } else {
                this.publishUids();
            }
        }, USERS_GET_DEBOUNCE),
        publishUids: function () {
            var data, uids;
            function getUid(uid) {
                return this.get('users').get(uid);
            }

            while (this.usersGetQueue.length) {
                uids = this.usersGetQueue.pop();
                data = uids.map(getUid, this);

                Mediator.pub('users:' + uids.join(), data);
            }
        }
    });
});
