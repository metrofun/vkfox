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
            buddies: new Backbone.Collection()
        },
        getFriendsDeferred: new jQuery.Deferred(),
        initialize: function () {
            var self = this;

            Mediator.pub('users:getFriends');
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
        }
    });
});
