/*jshint bitwise:false */
define([
    'underscore',
    'backbone',
    'request/request',
    'mediator/mediator'
], function (_, Backbone, request, Mediator) {
    var LONG_POLL_WAIT = 25;

    return Backbone.Model.extend({
        initialize: function (params) {
            var self = this;

            this.enableLongPollUpdates();
        },
        enableLongPollUpdates: function () {
            var self = this;
            request.api({
                code: 'return API.messages.getLongPollServer();'
            }).done(function (response) {
                self.params = response;
                self.fetchUpdates();
            });
        },
        fetchUpdates: function () {
            var self = this;

            request.get('http://' + this.params.server, {
                act: 'a_check',
                key:  this.params.key,
                ts: this.params.ts,
                wait: LONG_POLL_WAIT,
                mode: 2
            }, function (response) {
                var data = JSON.parse(jQuery.trim(response));

                if (!data.updates) {
                    self.enableLongPollUpdates();
                    return;
                } else {
                    Mediator.pub('longpoll:updates', data.updates);
                }

                self.params.ts = data.ts;
                self.fetchUpdates();
            }, 'text').fail(function () {
                self.enableLongPollUpdates();
            });
        }
    });
});
