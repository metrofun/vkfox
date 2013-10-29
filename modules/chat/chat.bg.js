/*jshint bitwise:false, latedef: false */
angular.module('chat', [
    'request',
    'mediator',
    'persistent-set',
    'auth',
    'longpoll',
    'profiles-collection',
    'notifications',
    'i18n',
    'common',
    'persistent-model',
    'router',
    'browser',
    'tracker'
]).run(function (
    Users,
    Request,
    Mediator,
    Auth,
    ProfilesCollection,
    NotificationsQueue,
    PersistentModel,
    $filter,
    NOTIFICATIONS_CHAT,
    Router,
    Browser,
    Tracker
) {
    var
    MAX_HISTORY_COUNT = 10,

    dialogColl = new (Backbone.Collection.extend({
        comparator: function (dialog) {
            var messages = dialog.get('messages');
            return - messages[messages.length - 1].date;
        }
    }))(),
    profilesColl = new (ProfilesCollection.extend({
        model: Backbone.Model.extend({
            idAttribute: 'uid'
        })
    }))(),
    persistentModel, userId,
    readyDeferred = jQuery.Deferred(),

    /**
     * Notifies about current state of module.
     * Has a tiny debounce to make only one publish per event loop
     */
    publishData = _.debounce(function publishData() {
        Mediator.pub('chat:data', {
            dialogs: dialogColl.toJSON(),
            profiles: profilesColl.toJSON()
        });
    }, 0);
    /**
     * Initialize all internal state
     */
    function initialize() {
        dialogColl.reset();
        profilesColl.reset();

        if (!readyDeferred || readyDeferred.state() === 'resolved') {
            if (readyDeferred) {
                readyDeferred.reject();
            }
            readyDeferred = jQuery.Deferred();
        }
        readyDeferred.then(function () {
            persistentModel = new PersistentModel({}, {
                name: ['chat', 'background', userId].join(':')
            });

            persistentModel.on('change:latestMessageId', function () {
                var messages = dialogColl.first().get('messages'),
                    message = messages[messages.length - 1],
                    profile, gender;

                // don't notify on first run,
                // when there is no previous value
                if (!this._previousAttributes.hasOwnProperty('latestMessageId')) {
                    return;
                }

                if (!message.out) {
                    profile = profilesColl.get(message.uid).toJSON();
                    gender = profile.sex === 1 ? 'female':'male';

                    // Don't notify, when active tab is vk.com
                    Browser.isVKSiteActive().then(function (active) {
                        if (!active) {
                            var chatActive = isChatTabActive();

                            NotificationsQueue.push({
                                type: NOTIFICATIONS_CHAT,
                                title: $filter('i18n')('sent a message', {
                                    NAME: $filter('name')(profile),
                                    GENDER: gender
                                }),
                                message: message.body,
                                image: profile.photo,
                                noBadge: chatActive,
                                noPopup: chatActive
                            });
                        }
                    });
                }
            });
            updateLatestMessageId();
            publishData();
        });
    }
    /**
     * Returns true if extension popup
     * is visible and 'chat' is current tab
     *
     * @returns {Boolean}
     */
    function isChatTabActive() {
        return Browser.isPopupOpened() && Router.isChatTabActive();
    }
    /**
     * @param {Object} update Update object from long poll
     */
    function addNewMessage(update) {
        var messageId = update[1],
            flags = update[2],
            attachment = update[7],
            dialog, messageDeferred,
            dialogCompanionUid = update[3];

        // For messages from chat attachment contains "from" property
        if (_(attachment).isEmpty()) {

            // mimic response from server
            messageDeferred = jQuery.Deferred().resolve([1, {
                body: update[6],
                title: update[5],
                date: update[4],
                uid: dialogCompanionUid,
                read_state: +!(flags & 1),
                mid: messageId,
                out: +!!(flags & 2)
            }]);
        } else {
            messageDeferred = Request.api({
                code: 'return API.messages.getById({chat_active: 1, mid: ' + messageId + '});'
            });
        }

        messageDeferred.then(function (response) {
            var message = response[1],
                dialogId = message.chat_id ? 'chat_id_' + message.chat_id:'uid_' + dialogCompanionUid;

            dialog = dialogColl.get(dialogId);
            if (dialog) {
                dialog.get('messages').push(message);
                removeReadMessages(dialog);
            } else {
                // TODO add parse function and move this code into dialogColl
                dialogColl.add({
                    id: dialogId,
                    uid: dialogCompanionUid,
                    chat_id: message.chat_id,
                    chat_active: message.chat_active,
                    messages: [message]
                }, {silent: true});
            }

            return fetchProfiles().then(function () {
                // important to trogger change, when profiles are available
                // because will cause an error, when creating notifications
                dialogColl.trigger('change');
                return message;
            });
        });
    }
    function fetchProfiles() {
        var uids = dialogColl.reduce(function (uids, dialog) {
            dialog.get('messages').map(function (message) {
                var chatActive = message.chat_active;
                if (chatActive) {
                    uids = uids.concat(chatActive.map(function (uid) {
                        return Number(uid);
                    })).concat(userId);
                } else {
                    uids = uids.concat([message.uid, dialog.get('uid')]);
                }
            });
            return uids;
        }, []);

        uids.push(userId);
        uids = _.uniq(uids);

        return Users.getProfilesById(uids).then(function (data) {
            profilesColl.reset(data);
            // mark self profile
            profilesColl.get(userId).set('isSelf', true);
        });
    }
    /*
     * Removes read messages from dialog,
     * leaves only first one or unread in sequence
     *
     * @param {Backbone.Model} dialog subject for mutation
     */
    function removeReadMessages(dialog) {
        var messages = dialog.get('messages'),
            result = [messages.pop()],
            originalOut = result[0].out;

        messages.reverse().some(function (message) {
            if (message.out === originalOut && message.read_state === 0) {
                result.unshift(message);
            } else {
                // stop copying messages
                return true;
            }
        });
        dialog.set({'messages': result}, {silent: true});
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
                if (historyMessages && historyMessages[0]) {
                    unreadDialogs[index].set({
                        'messages': historyMessages.slice(1).reverse()
                    }, {silent: 'yes'});
                    removeReadMessages(unreadDialogs[index]);
                }
            });
        });
    }
    function onUpdates(updates) {
        updates.forEach(function (update) {
            var messageId, mask, readState;

            // @see http://vk.com/developers.php?oid=-17680044&p=Connecting_to_the_LongPoll_Server
            switch (update[0]) {
                // reset message flags (FLAGS&=~$mask)
            case 3:
                messageId = update[1],
                mask = update[2];
                readState = mask & 1;
                if (messageId && mask && readState) {
                    dialogColl.some(function (dialog) {
                        return dialog.get('messages').some(function (message) {
                            if (message.mid === messageId) {
                                message.read_state = readState;
                                removeReadMessages(dialog);
                                if (readState) {
                                    Mediator.pub('chat:message:read', message);
                                }
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
    /**
     * Updates "latestMessageId" with current last message
     * Should be called on every incoming message
     */
    function updateLatestMessageId() {
        var messages;

        if (dialogColl.size()) {
            messages = dialogColl.first().get('messages');

            persistentModel.set(
                'latestMessageId',
                messages[messages.length - 1].mid
            );
        }
    }

    function getDialogs() {
        return Request.api({
            code: 'return API.messages.getDialogs({preview_length: 0});'
        }).then(function (response) {
            if (response && response[0]) {
                dialogColl.reset(response.slice(1).map(function (item) {
                    return {
                        id: item.chat_id ? 'chat_id_' + item.chat_id:'uid_' + item.uid,
                        chat_id: item.chat_id,
                        chat_active: item.chat_active,
                        uid: item.uid,
                        messages: [item]
                    };
                }));
            }
        });
    }

    readyDeferred.then(function () {
        Mediator.sub('longpoll:updates', onUpdates);

        // Notify about changes
        dialogColl.on('change', function () {
            dialogColl.sort();
            updateLatestMessageId();
            publishData();
        });
        profilesColl.on('change', publishData);
    });

    Mediator.sub('auth:success', function (data) {
        initialize();

        userId = data.userId;
        getDialogs().then(getUnreadMessages).then(fetchProfiles).then(function () {
            readyDeferred.resolve();
        });
    });

    Mediator.sub('chat:data:get', function () {
        readyDeferred.then(publishData);
    });
});
