/*jshint bitwise:false */
define([
    'underscore',
    'backbone',
    'request/request',
    'mediator/mediator',
    'auth/model'
], function (_, Backbone, request, Mediator, AuthModel) {
    var LONG_POLL_WAIT = 25,
        MAX_HISTORY_COUNT = 10;

    return Backbone.Model.extend({
        defaults: {
            dialogs : new (Backbone.Collection.extend({
                comparator: function (dialog) {
                    var messages = dialog.get('messages');
                    return - messages[messages.length - 1].date;
                }
            }))()
        },
        getDialogs: function () {
            var self = this;

            return request.api({
                code: 'return API.messages.getDialogs({preview_length: 0});'
            }).done(function (response) {
                self.get('dialogs').reset(response.slice(1).map(function (item) {
                    // convert dialog data into message data
                    return {
                        id: item.chat_id ? 'chat_id_' + item.chat_id:'uid_' + item.uid,
                        chat_id: item.chat_id,
                        uid: item.uid,
                        messages: [self.convertDialogIntoMessageData(item)]
                    };
                }));
            });
        },
        /*
         * If last message in dialog is unread,
         * fetch dialog history and get last unread messages in a row
         */
        getUnreadMessages: function () {
            // FIXME wtf models.filter?
            var unreadDialogs = this.get('dialogs').models.filter(function (dialog) {
                return !dialog.get('chat_id') && !dialog.get('messages')[0].read_state;
            }),
            unreadHistoryRequests = unreadDialogs.map(function (dialog) {
                return request.api({
                    code: 'return API.messages.getHistory({uid: ' + dialog.get('uid') + ', count: ' + MAX_HISTORY_COUNT + '});'
                });
            }), self = this;

            return jQuery.when.apply(jQuery, unreadHistoryRequests).done(function () {
                _(arguments).each(function (messages, index) {
                    // zero index contains quantity
                    unreadDialogs[index].set('messages', messages.slice(1).reverse());
                    self.removeReadMessages(unreadDialogs[index]);
                });
            });
        },
        /*
         * Removes read messages from dialog,
         * leaves only first one or unread in sequence
         *
         * @param {Backbone.Model} dialog subject for mutation
         */
        removeReadMessages: function (dialog) {
            var messages = dialog.get('messages'),
                updatedMessages = [], dialogOut = messages[messages.length - 1].out;

            messages.reverse().some(function (message) {
                if (message.out !== dialogOut && message.read_state) {
                    return true;
                } else {
                    updatedMessages.unshift(message);
                }
            });
            dialog.set('messages', updatedMessages);
        },
        convertDialogIntoMessageData: function (dialog) {
            var message = dialog;
            if (message.out) {
                message.uid = this.userId;
                delete message.out;
            }
            return message;
        },
        getProfiles: function () {
            var self = this;
            return jQuery.when.apply(jQuery, this.get('dialogs').map(function (dialog) {
                var
                uids = _.uniq(_.flatten(dialog.get('messages').map(function (message) {
                    var chatActive = message.chat_active;
                    if (chatActive) {
                        return chatActive.split(',').map(function (uid) {return parseInt(uid, 10); });
                    } else {
                        return [message.uid, dialog.get('uid')];
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
                    dialog.set('profiles', []);
                    deffer.resolve();
                }
                return deffer;
            }));
        },
        initialize: function (params) {
            var self = this;

            this.userId = params.userId;
            this.getDialogs().done(function () {
                jQuery.when(
                    self.getUnreadMessages(),
                    self.getProfiles()
                ).done(function () {
                    Mediator.sub('chat:view', function () {
                        Mediator.pub('chat:data', self.toJSON());
                    });
                    Mediator.pub('chat:data', self.toJSON());
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
                var data = JSON.parse(jQuery.trim(response));

                if (!data.updates) {
                    self.enableLongPollUpdates();
                    return;
                }

                data.updates.forEach(function (update) {
                    var messageId, mask;

                    // @see http://vk.com/developers.php?oid=-17680044&p=Connecting_to_the_LongPoll_Server
                    switch (update[0]) {
                    // reset message flags (FLAGS&=~$mask)
                    case 3:
                        messageId = update[1],
                        mask = update[2];
                        if (messageId && mask) {
                            self.get('dialogs').some(function (dialog) {
                                return dialog.get('messages').some(function (message) {
                                    if (message.mid === messageId) {
                                        message.read_state = mask & 1;
                                        self.removeReadMessages(dialog);
                                        Mediator.pub('chat:data', self.toJSON());
                                        return true;
                                    }
                                });
                            });
                        }
                        break;
                    case 4:
                        self.addNewMessage(update);
                        break;
                    }
                });

                self.longPollParams.ts = data.ts;
                self.fetchUpdates();
            }, 'text').fail(function () {
                self.enableLongPollUpdates();
            });
        },
        /*
         * @param {Object} update Update object from long poll
         */
        addNewMessage: function (update) {
            var messageId = update[1],
                flags = update[2],
                attachment = update[7],
                message, dialog, messageDeferred,
                self = this, out;

            if (_(attachment).isEmpty()) {
                out = +!!(flags & 2);
                // zero index contains quantity
                messageDeferred = jQuery.Deferred().resolve([1, {
                    body: update[6],
                    title: update[5],
                    date: update[4],
                    uid: out ? update[3]:self.userId,
                    read_state: +!(flags & 1),
                    mid: messageId,
                    // out: +!!(flags & 2)
                }]);
                console.log('isEmpty');
            } else {
                messageDeferred = request.api({
                    code: 'return API.messages.getById({mid: ' + messageId + '});'
                });
                console.log('getById');
            }

            messageDeferred.done(function (response) {
                // zero index contains quantity
                var message = response[1],
                    dialogId = message.chat_id ? 'chat_id_' + message.chat_id:'uid_' + message.uid;

                dialog = self.get('dialogs').get(dialogId);
                if (dialog) {
                    dialog.get('messages').push(message);
                    self.removeReadMessages(dialog);
                    self.get('dialogs').sort();
                    Mediator.pub('chat:data', self.toJSON());
                } else {
                    self.get('dialogs').add({
                        id: dialogId,
                        uid: message.uid,
                        chat_id: message.chat_id,
                        messages: [message]
                    });

                    self.get('dialogs').sort();
                    self.getProfiles().done(function () {
                        Mediator.pub('chat:data', self.toJSON());
                    });
                }
            });
        }
    });
});
