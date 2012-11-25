define([
    'underscore',
    'backbone',
    'request/request',
    'mediator/mediator'
], function (_, Backbone, request, Mediator) {
    return Backbone.Model.extend({
        defaults: {
            dialogsItems : new Backbone.Collection(),
            friends: new Backbone.Collection(),
            nonFriendsProfiles : new Backbone.Collection(),
            ready: false
        },
        initialize: function () {
            Mediator.sub('chat:view', function () {
                if (this.get('ready')) {
                    Mediator.pub('chat:data', this.toJSON());
                } else {
                    this.on('change:ready', function handler() {
                        this.off('change:ready', handler);

                        Mediator.pub('chat:data', this.toJSON());
                    });
                }
            }.bind(this));

            jQuery.when(
                request.api({code: 'return API.messages.getDialogs({preview_length: 0});'}),
                request.api({code: 'return API.friends.get({fields : "photo,sex,nickname,lists", order: "hints"});'})
            ).done(function (dialogResponse, friendsResponse) {
                var uids;

                this.get('dialogsItems').reset(dialogResponse);
                this.get('friends').add(friendsResponse);

                // get all uids from messages
                uids = _.uniq(_.flatten(this.get('dialogsItems').slice(1).map(function (item) {
                    var chatActive = item.get('chat_active');
                    return chatActive ? chatActive.split(','):item.get('uid') + '';
                }), true)).map(function (uid) {return parseInt(uid, 10); });
                // remove friends' uids
                uids = _.without.apply(_, [uids].concat(this.get('friends').pluck('uid')));

                if (uids.length) {
                    Mediator.pub('users:get', uids);
                    Mediator.sub('users:' + uids.join(), function handler(data) {
                        Mediator.unsub('users:' + uids.join(), handler);

                        this.get('nonFriendsProfiles').reset(data);
                        this.set('ready', true);
                    }.bind(this));
                } else {
                    this.set('ready', true);
                }
            }.bind(this));
        }
    });
});
