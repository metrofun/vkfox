define([
    'backbone',
    'underscore',
    'request/request',
    'mediator/mediator',
    'users/model',
    'jquery'
], function (Backbone, _, request, Mediator, UsersModel, jQuery) {
    return Backbone.Model.extend({
        defaults: {
            buddies: new (Backbone.Collection.extend({
                model: Backbone.Model.extend({
                    idAttribute: 'uid'
                }),
                comparator: function (buddie) {
                    if (buddie.get('favourite')) {
                        return -1;
                    } else {
                        return buddie.get('originalIndex') || 0;
                    }
                }
            }))()
        },
        getFriendsDeferred: new jQuery.Deferred(),
        initialize: function () {
            var self = this;

            self.getFavouriteUsers();
            Mediator.pub('users:friends:get');
            Mediator.once('users:friends', function (friends) {
                self.get('buddies').add(friends);
                self.getFriendsDeferred.resolve();
                Mediator.pub('buddies:data', friends);
            });

            Mediator.sub('buddies:data:get', function () {
                self.getFriendsDeferred.done(function () {
                    Mediator.pub('buddies:data', self.get('buddies').toJSON());
                });
            });
            Mediator.sub('buddies:favourite:toggle', self.toggleBuddieField.bind(self, 'favourite'));
            Mediator.sub('buddies:watched:toggle', self.toggleBuddieField.bind(self, 'watched'));
        },
        getFavouriteUsers: function () {
            request.api({
                code: 'return API.fave.getUsers()'
            }).then(function (response) {
                console.log(response);
                UsersModel.getProfilesById(_.pluck(response.slice(1), 'id')).then(function () {
                    console.log(arguments);
                });
            });
        },
        /**
         * Toggles boolean field of buddie.
         * If buddie is unknown, then fetch it and add to list.
         * Also resorts models.
         *
         * @param {String} field Name of field
         * @param {Number} uid Friend or non friend id
         */
        toggleBuddieField: function (field, uid) {
            var buddies = this.get('buddies'),
                profile = buddies.get(uid);

            if (profile) {
                if (profile.get(field)) {
                    if (profile.get('isFriend')) {
                        profile.unset(field);
                        buddies.sort();
                    } else {
                        buddies.remove(profile);
                    }
                } else {
                    // Need to index friends, when fields are changed
                    // So it would be correctly placed, when field unchanged
                    this.indexFriendModels();
                    profile.set(field, true);
                    buddies.sort();
                }

                Mediator.pub('buddies:data', buddies.toJSON());
            } else {
                // Need to fetch non-friend profile
                Mediator.pub('users:get', uid);
                Mediator.once('users:' + uid, function (profile) {
                    profile[field] = true;
                    buddies.unshift(profile);
                    Mediator.pub('buddies:data', buddies.toJSON());
                });
            }
        },
        /**
         * After changing and unchanging any field of buddie,
         * we need to place it to original place in list,
         * So we add index property.
         * Runs once.
         */
        indexFriendModels: function () {
            var buddies = this.get('buddies'),
                length = buddies.length;

            if (length && !buddies.at(length - 1).get('originalIndex')) {
                buddies.forEach(function (buddie, i) {
                    buddie.set('originalIndex', i);
                });
            }
        }
    });
});
