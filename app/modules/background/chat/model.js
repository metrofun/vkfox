define([
    'underscore',
    'backbone',
    'request/request',
    'mediator/mediator'
], function (_, Backbone, request, Mediator) {
    var LONG_POLL_WAIT = 25;

    return Backbone.Model.extend({
        defaults: {
            dialogs: new Backbone.Collection({
                messages: new Backbone.Collection()
            })
        },
        getDialogs: function () {
            var self = this;

            return request.api({
                code: 'return API.messages.getDialogs({preview_length: 0});'
            }).done(function (response) {
                self.get('dialogs').reset(response.slice(1).map(function (item) {
                    return new Backbone.Model({
                        chat_id: item.chat_id,
                        uid: item.uid,
                        id: item.chat_id + ' ' +  item.uid,
                        messages: [item]
                    });
                }));
            });
        },
        /*
        * If last message in dialog is unread,
        * fetch dialog history and get last unread messages in a row
        */
        getUnreadMessages: function () {
            var unreadHistoryRequests = this.get('dialogs').models.filter(function (dialog) {
                return !dialog.get('chat_id') && !dialog.get('read_state');
            }).map(function (dialog) {
                return request.api({
                    code: 'return API.messages.getHistory({uid: ' + dialog.get('uid') + '});'
                });
            }), self = this;
            return jQuery.when.apply(jQuery, unreadHistoryRequests).done(function () {
                [].forEach.call(arguments, function (messages, index) {
                    var i, dialog, message = messages[1];

                    if (message.read_state === 0) {
                        dialog = self.get('dialogs').at(index);

                        for (i = 2; i < messages.length; i++) {
                            message = messages[i];
                            if (message.read_state === 0) {
                                dialog.get('messages').push(message);
                            } else {
                                break;
                            }
                        }
                    }
                });
            });
        },
        getProfiles: function () {
            return jQuery.when.apply(jQuery, this.get('dialogs').models.map(function (dialog) {
                var
                uids = _.uniq(_.flatten(dialog.get('messages').map(function (message) {
                    var chatActive = message.chat_active;
                    if (chatActive) {
                        return chatActive.split(',').map(function (uid) {return parseInt(uid, 10); });
                    } else {
                        return message.uid;
                    }
                }))),
                deffer = jQuery.Deferred();

                if (uids.length) {
                    Mediator.pub('users:get', uids);
                    Mediator.sub('users:' + uids.join(), function handler(data) {
                        Mediator.unsub('users:' + uids.join(), handler);

                        dialog.set('profiles', data);
                        deffer.resolve();
                    });
                } else {
                    deffer.resolve();
                }
                return deffer;
            }));
        },
        initialize: function () {
            var self = this;

            this.getDialogs().done(function () {
                jQuery.when([
                    self.getUnreadMessages(),
                    self.getProfiles()
                ]).done(function () {
                    Mediator.sub('chat:view', function () {
                        Mediator.pub('chat:data', self.toJSON());
                    });
                });
            });
            this.enableLongPollUpdates();
        },
        enableLongPollUpdates: function () {
            var self = this;
            request.api({
                code: 'return API.messages.getLongPollServer();'
            }).done(function (response) {
                self.longPollParams = response;
                self.fetchUpdates();
            });
        },
        fetchUpdates: function () {
            var self = this;

            request.get('http://' + this.longPollParams.server, {
                act: 'a_check',
                key:  this.longPollParams.key,
                ts: this.longPollParams.ts,
                wait: LONG_POLL_WAIT,
                mode: 2
            }, function (response) {
                var
                data = JSON.parse(jQuery.trim(response)),
                updates = data.updates.filter(function (update) {
                    return update[0] >= 0 && update[0] <= 4;
                });

                if (updates.length) {
                    self.getDialogs();
                }

                self.longPollParams.ts = data.ts;
                self.fetchUpdates();
            }, 'text').fail(function () {
                self.enableLongPollUpdates();
            });
        }
    });
});
