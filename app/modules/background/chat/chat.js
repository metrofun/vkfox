/*jshint bitwise:false */
angular.module(
    'chat',
    ['request', 'mediator', 'persistent-set', 'auth', 'longpoll']
).run(function (Users, Request, Mediator, Auth) {
    var
    MAX_HISTORY_COUNT = 10,

    dialogColl = new (Backbone.Collection.extend({
        comparator: function (dialog) {
            var messages = dialog.get('messages');
            return - messages[messages.length - 1].date;
        }
    }))(),
    userId, readyDeferred = jQuery.Deferred();

    /*
     * @param {Object} update Update object from long poll
     */
    function addNewMessage(update) {
        var messageId = update[1],
            flags = update[2],
            attachment = update[7],
            dialog, messageDeferred,
            dialogCompanionUid = update[3],
            out;

        // For messages from chat attachment contains "from" property
        if (_(attachment).isEmpty()) {
            out = +!!(flags & 2);

            // mimic response from server
            messageDeferred = jQuery.Deferred().resolve({
                count: 1,
                items: [{
                    body: update[6],
                    title: update[5],
                    date: update[4],
                    uid: out ? userId:dialogCompanionUid,
                    read_state: +!(flags & 1),
                    id: messageId
                    // out: +!!(flags & 2)
                }]
            });
        } else {
            messageDeferred = Request.api({
                code: 'return API.messages.getById({mid: ' + messageId + '});'
            });
        }

        messageDeferred.done(function (response) {
            var message = response.items[0],
                dialogId = message.chat_id ? 'chat_id_' + message.chat_id:'uid_' + dialogCompanionUid;

            dialog = dialogColl.get(dialogId);
            if (dialog) {
                dialog.get('messages').push(message);
                removeReadMessages(dialog);
            } else {
                dialogColl.add({
                    id: dialogId,
                    uid: dialogCompanionUid,
                    chat_id: message.chat_id,
                    messages: [message]
                });

                setDialogsProfiles();
            }
        });
    }
    function setDialogsProfiles() {
        return jQuery.when.apply(jQuery, dialogColl.map(function (dialog) {
            var
            uids = _.uniq(_.flatten(dialog.get('messages').map(function (message) {
                var chatActive = message.chat_active;
                if (chatActive) {
                    return chatActive.map(function (uid) {
                        return parseInt(uid, 10);
                    }).concat(userId);
                } else {
                    return [message.uid, dialog.get('uid')];
                }
            })));

            if (uids.length) {
                return Users.getProfilesById(uids).then(function (data) {
                    dialog.set('profiles', [].concat(data));
                });
            } else {
                dialog.set('profiles', []);
                return jQuery.Deferred().resolve();
            }
        }));
    }
    /*
     * Removes read messages from dialog,
     * leaves only first one or unread in sequence
     *
     * @param {Backbone.Model} dialog subject for mutation
     */
    function removeReadMessages(dialog) {
        var messages = dialog.get('messages'),
            updatedMessages = [messages[messages.length - 1]],
            dialogCompanionUid = messages[messages.length - 1].uid;

        messages.reverse().slice(1).some(function (message) {
            if (message.id !== dialogCompanionUid && message.read_state) {
                return true;
            } else {
                updatedMessages.unshift(message);
            }
        });
        dialog.set('messages', updatedMessages);
    }
    /*
     * If last message in dialog is unread,
     * fetch dialog history and get last unread messages in a row
     */
    function getUnreadMessages() {
        // FIXME wtf models.filter?
        var unreadDialogs = dialogColl.models.filter(function (dialog) {
            return !dialog.get('chat_id') && !dialog.get('messages')[0].read_state;
        }),
        unreadHistoryRequests = unreadDialogs.map(function (dialog) {
            return Request.api({code: 'return API.messages.getHistory({user_id: '
                + dialog.get('uid') + ', count: '
                + MAX_HISTORY_COUNT + '});'});
        });

        return jQuery.when.apply(jQuery, unreadHistoryRequests).done(function () {
            _(arguments).each(function (historyMessages, index) {
                if (historyMessages && historyMessages.count) {
                    unreadDialogs[index].set(
                        'messages',
                        historyMessages.items.reverse().map(convertHistoryIntoMessageData)
                    );
                    removeReadMessages(unreadDialogs[index]);
                }
            });
        });
    }
    function onUpdates(updates) {
        updates.forEach(function (update) {
            var messageId, mask;

            // @see http://vk.com/developers.php?oid=-17680044&p=Connecting_to_the_LongPoll_Server
            switch (update[0]) {
                // reset message flags (FLAGS&=~$mask)
            case 3:
                messageId = update[1],
                mask = update[2];
                if (messageId && mask) {
                    dialogColl.some(function (dialog) {
                        return dialog.get('messages').some(function (message) {
                            if (message.id === messageId) {
                                message.read_state = mask & 1;
                                removeReadMessages(dialog);
                                dialogColl.trigger('change');
                                return true;
                            }
                        });
                    });
                }
                break;
            case 4:
                addNewMessage(update);
                break;
            }
        });
    }
    function convertHistoryIntoMessageData(history) {
        var message = history;

        message.uid = history.from_id;

        return message;
    }
    function convertDialogIntoMessageData(dialog) {
        var message = dialog;

        if (message.out) {
            message.uid = userId;
            delete message.out;
        }
        return message;
    }
    function getDialogs() {
        return Request.api({
            code: 'return API.messages.getDialogs({preview_length: 0});'
        }).then(function (response) {
            if (response && response.count) {
                dialogColl.reset(response.items.map(function (item) {
                    // convert dialog data into message data
                    return {
                        id: item.chat_id ? 'chat_id_' + item.chat_id:'uid_' + item.uid,
                        chat_id: item.chat_id,
                        uid: item.uid,
                        messages: [convertDialogIntoMessageData(item)]
                    };
                }));
            }
        });
    }

    Auth.getUserId().then(function (uid) {
        userId = uid;

        getDialogs().then(getUnreadMessages).then(setDialogsProfiles).then(function () {
            readyDeferred.resolve();
        });
    });

    Mediator.sub('chat:data:get', function () {
        readyDeferred.then(function () {
            Mediator.pub('chat:data', dialogColl.toJSON());
        });
    });
    readyDeferred.then(function () {
        Mediator.sub('longpoll:updates', onUpdates);

        dialogColl.on('change', function () {
            dialogColl.sort();
            Mediator.pub('chat:data', dialogColl.toJSON());
        });
    });
});
