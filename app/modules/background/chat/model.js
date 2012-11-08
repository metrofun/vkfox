define([
    'underscore',
    'backbone',
    'request/request',
    'mediator/mediator'
], function (_, Backbone, request, Mediator) {
    return Backbone.Model.extend({
        defaults: {
            items : new Backbone.Collection(),
            profiles : new Backbone.Collection(),
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

            request.api({
                code: 'return API.messages.getDialogs();'
            }).done(function (response) {
                var uids;
                if (response && response.length > 1) {
                    this.get('items').reset(response);

                    // get all uids from messages
                    uids = _.uniq([].concat.apply([], this.get('items').slice(1).map(function (item) {
                        var chatActive = item.get('chat_active');
                        return chatActive ? chatActive.split(','):item.get('uid') + '';
                    }))).map(function (uid) {return parseInt(uid, 10); });

                    if (uids.length) {
                        Mediator.pub('users:get', uids);
                        Mediator.sub('users:' + uids.join(), function handler(data) {
                            Mediator.unsub('users:' + uids.join(), handler);

                            this.get('profiles').reset(data);
                            this.set('ready', true);
                        }.bind(this));
                    } else {
                        this.set('ready', true);
                    }
                }
            }.bind(this));
        }
    });
});
