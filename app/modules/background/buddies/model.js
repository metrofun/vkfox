define([
    'backbone',
    'underscore',
    'request/request',
    'mediator/mediator',
    'jquery'
], function (Backbone, _, request, Mediator, jQuery) {
    var DROP_PROFILES_INTERVAL = 30000,
        USERS_GET_DEBOUNCE = 400;

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

            Mediator.pub('users:friends:get');
            Mediator.once('users:friends', function (friends) {
                self.get('buddies').add(friends);
                self.getFriendsDeferred.resolve();
                Mediator.pub('buddies:data', friends);
            });

            Mediator.sub('buddies:getData', function () {
                self.getFriendsDeferred.done(function () {
                    Mediator.pub('buddies:data', self.get('buddies').toJSON());
                });
            });
            Mediator.sub('buddies:favourite:toggle', self.toggleFavourite.bind(self));
        },
        toggleFavourite: function (uid) {
            var buddies = this.get('buddies'),
                profile = buddies.get(uid);

            if (profile) {
                if (profile.get('favourite')) {
                    if (profile.get('isFriend')) {
                        profile.unset('favourite');
                        buddies.sort();
                    } else {
                        buddies.remove(profile);
                    }
                } else {
                    // Index only on set, on unset it will be already indexed
                    this.indexFriendModels();
                    profile.set('favourite', true);
                    buddies.sort();
                }

                Mediator.pub('buddies:data', buddies.toJSON());
            } else {
                // Need to fetch non-friend profile
                Mediator.pub('users:get', uid);
                Mediator.once('users:' + uid, function (profile) {
                    profile.favourite = true;
                    buddies.unshift(profile);
                    Mediator.pub('buddies:data', buddies.toJSON());
                });
            }
        },
        /**
         * After favouriting and defavouriting friend
         * must return to his previous position.
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
