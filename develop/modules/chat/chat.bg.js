/*jshint bitwise:false */
var
MAX_HISTORY_COUNT = 10,

_ = require('underscore')._,
Vow = require('vow'),
Backbone = require('backbone'),
Request = require('request/request.bg.js'),
Mediator = require('mediator/mediator.js'),
Users = require('users/users.bg.js'),
Router = require('router/router.bg.js'),
Browser = require('browser/browser.bg.js'),
I18N = require('i18n/i18n.js'),
Notifications = require('notifications/notifications.bg.js'),
PersistentModel = require('persistent-model/persistent-model.js'),
ProfilesCollection = require('profiles-collection/profiles-collection.bg.js'),

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
readyPromise = Vow.promise(),

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

/**
 * Initialize all internal state
 */
function initialize() {
    dialogColl.reset();
    profilesColl.reset();

    if (!readyPromise || readyPromise.isFulfilled()) {
        if (readyPromise) {
            readyPromise.reject();
        }
        readyPromise = Vow.promise();
    }
    readyPromise.then(function () {
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
                        var chatActive = Browser.isPopupOpened() && Router.isChatTabActive();

                        Notifications.notify({
                            type: Notifications.CHAT,
                            title: I18N.get('sent a message', {
                                NAME: Users.getName(profile),
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
    }).done();
}
function fetchProfiles() {
    var uids = dialogColl.reduce(function (uids, dialog) {
        dialog.get('messages').map(function (message) {
            var chatActive = message.chat_active;
            if (chatActive) {
                // unfortunately chatActive sometimes
                // don't contain actual sender
                uids = uids.concat(chatActive.map(function (uid) {
                    return Number(uid);
                })).concat(userId, message.uid);
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
        messageDeferred = Vow.promise([1, {
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
    }).done();
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

    return Vow.all(unreadHistoryRequests).spread(function () {
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
        console.log(update);
        var messageId, mask, readState;

        // @see http://vk.com/developers.php?oid=-17680044&p=Connecting_to_the_LongPoll_Server
        switch (update[0]) {
            // reset message flags (FLAGS&=~$mask)
        case 3:
            messageId = update[1];
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

readyPromise.then(function () {
    Mediator.sub('longpoll:updates', onUpdates);

    // Notify about changes
    dialogColl.on('change', function () {
        dialogColl.sort();
        updateLatestMessageId();
        publishData();
    });
    profilesColl.on('change', publishData);
}).done();

Mediator.sub('auth:success', function (data) {
    initialize();

    userId = data.userId;
    getDialogs().then(getUnreadMessages).then(fetchProfiles).then(function () {
        readyPromise.fulfill();
    }).done();
});

Mediator.sub('chat:data:get', function () {
    readyPromise.then(publishData).done();
});
