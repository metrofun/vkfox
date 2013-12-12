;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('browser/browser.bg.js');
require('auth/auth.bg.js');
require('auth-monitor/auth-monitor.bg.js');
require('buddies/buddies.bg.js');
require('chat/chat.bg.js');
require('newsfeed/newsfeed.bg.js');
require('feedbacks/feedbacks.bg.js');
require('router/router.bg.js');
// TODO
// require('yandex/yandex.bg.js');
// require('tracker/tracker.bg.js');
require('force-online/force-online.bg.js');
require('longpoll/longpoll.bg.js');

},{"auth-monitor/auth-monitor.bg.js":2,"auth/auth.bg.js":3,"browser/browser.bg.js":4,"buddies/buddies.bg.js":5,"chat/chat.bg.js":6,"feedbacks/feedbacks.bg.js":9,"force-online/force-online.bg.js":10,"longpoll/longpoll.bg.js":15,"newsfeed/newsfeed.bg.js":19,"router/router.bg.js":27}],2:[function(require,module,exports){
var
CHECK_AUTH_PERIOD = 3000, //ms

_ = require('underscore')._,
Config = require('config/config.js'),
Request = require('request/request.bg.js'),
Auth = require('auth/auth.bg.js'),
Mediator = require('mediator/mediator.js'),

userId,
/**
 * Monitor whether the user is logged/relogged on vk.com.
 * Logout if user signed out. Relogin when user id changed
 */
monitorAuthChanges = _.debounce(function () {
    Request.get(Config.VK_BASE + 'feed2.php', null, 'json').then(function (response) {
        try {
            if (userId !== Number(response.user.id)) {
                Auth.login(true);
            } else {
                monitorAuthChanges();
            }
        } catch (e) {
            Auth.login(true);
        }
    }, monitorAuthChanges);
}, CHECK_AUTH_PERIOD);

Mediator.sub('auth:success', function (data) {
    userId = data.userId;
    monitorAuthChanges();
});

},{"auth/auth.bg.js":3,"config/config.js":7,"mediator/mediator.js":18,"request/request.bg.js":25,"underscore":35}],3:[function(require,module,exports){
var RETRY_INTERVAL = 10000, //ms
    CREATED = 1,
    IN_PROGRESS = 1,
    READY = 2,

    Config = require('config/config.js'),
    Mediator = require('mediator/mediator.js'),
    Env = require('env/env.js'),
    Browser = require('browser/browser.bg.js');

var _ = require('underscore')._,
    Backbone = require('backbone'),
    Vow = require('vow'),

    model = new Backbone.Model(),
    Auth, page, iframe,
    state = CREATED, authPromise = Vow.promise();

function closeAuthTabs() {
    if (Env.firefox) {
        // TODO
        // throw "Not implemented";
    } else {
        chrome.tabs.query({url: Config.AUTH_DOMAIN + '*'}, function (tabs) {
            tabs.forEach(function (tab) {
                chrome.tabs.remove(tab.id);
            });
        });
    }
}

// TODO run if one time
function tryLogin() {
    if (Env.firefox) {
        page = require("sdk/page-worker").Page({
            contentScript: 'self.postMessage(decodeURIComponent(window.location.href));',
            contentURL: Config.AUTH_URI,
            onMessage: function (url) {
                Mediator.pub('auth:iframe', url);
            }
        });
    } else {
        if (!iframe) {
            iframe = document.createElement("iframe");
            iframe.name = 'vkfox-login-iframe';
            document.body.appendChild(iframe);
        }
        iframe.setAttribute('src', Config.AUTH_URI + '&time=' + Date.now());
    }
}
function freeLogin() {
    if (Env.firefox) {
        page.destroy();
    } else {
        document.body.removeChild(iframe);
        iframe = null;
    }
    page = null;
}

function onSuccess(data) {
    state = READY;
    Browser.setIconOnline();
    authPromise.fulfill(data);
}

Mediator.sub('auth:iframe', function (url) {
    try {
        model.set('userId',  parseInt(url.match(/user_id=(\w+)(?:&|$)/i)[1], 10));
        model.set('accessToken',  url.match(/access_token=(\w+)(?:&|$)/i)[1]);

        closeAuthTabs();
        freeLogin();
    } catch (e) {
        // TODO control console.log
        console.log(e);
    }
}.bind(this));

Mediator.sub('auth:state:get', function () {
    Mediator.pub('auth:state', state);
});

Mediator.sub('auth:oauth', function () {
    Browser.createTab(Config.AUTH_URI);
});

Mediator.sub('auth:login', function (force) {
    Auth.login(force);
});

model.on('change:accessToken', function () {
    Mediator.pub('auth:success', model.toJSON());
});


module.exports = Auth = {
    retry: _.debounce(function () {
        if (state === IN_PROGRESS) {
            Auth.login(true);
            Auth.retry();
        }
    }, RETRY_INTERVAL),
    login: function (force) {
        if (force || state === CREATED) {
            Browser.setIconOffline();
            state = IN_PROGRESS;

            if (authPromise.isFulfilled()) {
                authPromise = Vow.promise();
            }

            tryLogin();
            Auth.retry();

            Mediator.unsub('auth:success', onSuccess);
            Mediator.once('auth:success', onSuccess);
        }
        return authPromise;
    },
    getAccessToken: function () {
        return Auth.login().then(function () {
            return model.get('accessToken');
        });
    },
    getUserId: function () {
        return Auth.login().then(function () {
            return model.get('userId');
        });
    }
};

Auth.login();

},{"backbone":32,"browser/browser.bg.js":4,"config/config.js":7,"env/env.js":8,"mediator/mediator.js":18,"sdk/page-worker":33,"underscore":35,"vow":36}],4:[function(require,module,exports){
var BADGE_COLOR = [231, 76, 60, 255],
    ICON_ONLINE = {
        "19": "assets/logo19.png",
        "38": "assets/logo38.png"
    },
    ICON_OFFLINE = {
        "19": "assets/logo19_offline.png",
        "38": "assets/logo38_offline.png"
    },

    Vow = require('vow'),
    Env = require('env/env.js'),
    _ = require('underscore'),

    Browser, browserAction;

// Set up popup and popup comminication
if (Env.firefox) {
    var data = require('sdk/self').data;

    browserAction = require('browserAction').BrowserAction({
        default_icon: data.url(ICON_ONLINE['19']),
        default_title: 'VKfox',
        default_popup: data.url('pages/popup.html')
    });

    // circular dependencies
    _.defer(function () {
        require('mediator/mediator.js').sub('browser:createTab', function (url) {
            Browser.createTab(url);
        });
    });
} else {
    browserAction = chrome.browserAction;
}

browserAction.setBadgeBackgroundColor({color: BADGE_COLOR});

module.exports = Browser = {
    getBrowserAction: function () {
        return browserAction;
    },
    /**
     * Sets icon to online status
     */
    setIconOnline: function () {
        browserAction.setIcon({path: ICON_ONLINE});
    },
    /**
     * Sets icon to offline status
     */
    setIconOffline: function () {
        browserAction.setIcon({path: ICON_OFFLINE});
    },
    /**
     * @param {String|Number} text
     */
    setBadgeText: function (text) {
        browserAction.setBadgeText({
            text: String(text)
        });
    },
    /**
     * Says whether popup is visible
     *
     * @returns {Boolean}
     */
    isPopupOpened: function () {
        if (Env.firefox) {
            // TODO fix stub
            return false;
        } else {
            return Boolean(chrome.extension.getViews({type: "popup"}).length);
        }
    },
    /**
     * Says whether vk.com is currently active tab
     *
     * @returns {Vow.promise} Returns promise that resolves to Boolean
     */
    isVKSiteActive: function () {
        var promise = Vow.promise();

        if (Env.firefox) {
            // TODO fix stub
            promise.fulfill(false);
        } else {
            chrome.tabs.query({active: true}, function (tabs) {
                if (tabs.every(function (tab) {
                    return tab.url.indexOf('vk.com') === -1;
                })) {
                    promise.fulfill(false);
                } else {
                    promise.fulfill(true);
                }
            });
        }

        return promise;
    },
    createTab: (function () {
        if (Env.firefox) {
            var tabs = require('sdk/tabs');

            return function (url) {
                tabs.open(url);
            };
        } else {
            return function (url) {
                chrome.tabs.create({url: url});
            };
        }
    })()
};

},{"browserAction":33,"env/env.js":8,"mediator/mediator.js":18,"sdk/self":33,"sdk/tabs":33,"underscore":35,"vow":36}],5:[function(require,module,exports){
var
_ = require('underscore')._,
Vow = require('vow'),
Backbone = require('backbone'),
Request = require('request/request.bg.js'),
Mediator = require('mediator/mediator.js'),
Users = require('users/users.bg.js'),
I18N = require('i18n/i18n.js'),
Notifications = require('notifications/notifications.bg.js'),
PersistentSet = require('persistent-set/persistent-set.bg.js'),
ProfilesCollection = require('profiles-collection/profiles-collection.bg.js'),

readyPromise,
watchedBuddiesSet = new PersistentSet('watchedBuddies'),
buddiesColl = new (ProfilesCollection.extend({
    model: Backbone.Model.extend({
        idAttribute: 'uid',
        // Automatically set last activity time
        // for all watched items
        initialize: function () {
            this.on('change:isWatched', function (model) {
                if (model.get('isWatched')) {
                    Request.api({
                        code: 'return API.messages.getLastActivity({user_id: '
                            + model.get('uid') + '})'
                    }).then(function (response) {
                        model
                            .set('online', response.online)
                            .set('lastActivityTime', response.time * 1000);

                        buddiesColl.sort();
                    }).done();
                } else {
                    model.unset('lastActivityTime');
                }
                buddiesColl.sort();
            });
        }
    }),
    comparator: function (buddie) {
        if (buddie.get('isWatched')) {
            if (buddie.get('lastActivityTime')) {
                return -buddie.get('lastActivityTime');
            } else {
                return -2;
            }
        } else if (buddie.get('isFave')) {
            return -1;
        } else {
            return buddie.get('originalIndex') || 0;
        }
    }
}))(),
publishData = _.debounce(function () {
    Mediator.pub('buddies:data', buddiesColl.toJSON());
}, 0);

/**
* Initialize all state
*/
function initialize() {
    if (!readyPromise || readyPromise.isFulfilled()) {
        if (readyPromise) {
            readyPromise.reject();
        }
        readyPromise = Vow.promise();
    }
    readyPromise.then(publishData).done();
}
initialize();

/**
* After changing and unchanging any field of buddie,
* we need to place it to original place in list,
* So we add index property.
* Runs once.
*/
function saveOriginalBuddiesOrder() {
    var length = buddiesColl.length;

    if (length && !buddiesColl.at(length - 1).get('originalIndex')) {
        buddiesColl.forEach(function (buddie, i) {
            buddie.set('originalIndex', i);
        });
    }
}

/**
* Returns profiles from bookmarks,
* and sets "isFave=true" on profile object
*
* @returns [jQuery.Deferred]
*/
function getFavouriteUsers() {
    return Request.api({
        code: 'return API.fave.getUsers()'
    }).then(function (response) {
        return Users.getProfilesById(
            _.pluck(response.slice(1),
            'uid'
            )).then(function (profiles) {
                profiles.forEach(function (profile) {
                    profile.isFave = true;
                });
                return profiles;
            });
    });
}

/**
* Extends buddiesColl with information
* about watched persons
*/
function setWatchedBuddies() {
    watchedBuddiesSet.toArray().forEach(function (uid) {
        var model = buddiesColl.get(uid);
        if (model) {
            model.set('isWatched', true);
        }
    });
}

// entry point
Mediator.sub('auth:success', function () {
    initialize();

    Vow.all([
        Users.getFriendsProfiles(),
        getFavouriteUsers()
    ]).spread(function (friends, favourites) {
        buddiesColl.reset([].concat(favourites, friends));

        saveOriginalBuddiesOrder();
        setWatchedBuddies();

        readyPromise.fulfill();
    }).done();
});

Mediator.sub('buddies:data:get', function () {
    readyPromise.then(publishData).done();
});

readyPromise.then(function () {
    buddiesColl.on('change', function (model) {
        var profile = model.toJSON(), gender;

        if (profile.isWatched && model.changed.hasOwnProperty('online')) {
            model.set({
                'lastActivityTime': Date.now()
            }, {silent: true});
            gender = profile.sex === 1 ? 'female':'male';

            // TODO
            // Notify about watched buddies
            Notifications.notify({
                type: Notifications.BUDDIES,
                title: [
                    Users.getName(profile),
                    I18N.get(profile.online ? 'is online':'went offline', {
                        GENDER: gender
                    })
                ].join(' '),
                image: model.get('photo'),
                noBadge: true
            });

            buddiesColl.sort();
        }
        publishData();
    });
}).done();

Mediator.sub('buddies:watch:toggle', function (uid) {
    if (watchedBuddiesSet.contains(uid)) {
        watchedBuddiesSet.remove(uid);
        buddiesColl.get(uid).unset('isWatched');
    } else {
        watchedBuddiesSet.add(uid);
        buddiesColl.get(uid).set('isWatched', true);
    }
});

},{"backbone":32,"i18n/i18n.js":12,"mediator/mediator.js":18,"notifications/notifications.bg.js":20,"persistent-set/persistent-set.bg.js":23,"profiles-collection/profiles-collection.bg.js":24,"request/request.bg.js":25,"underscore":35,"users/users.bg.js":31,"vow":36}],6:[function(require,module,exports){
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

},{"backbone":32,"browser/browser.bg.js":4,"i18n/i18n.js":12,"mediator/mediator.js":18,"notifications/notifications.bg.js":20,"persistent-model/persistent-model.js":22,"profiles-collection/profiles-collection.bg.js":24,"request/request.bg.js":25,"router/router.bg.js":27,"underscore":35,"users/users.bg.js":31,"vow":36}],7:[function(require,module,exports){
var Env = require('env/env.js');

exports.APP_ID = 3807372;
if (Env.firefox) {
    exports.TRACKER_ID = 'UA-9568575-4';
} else if (Env.chrome) {
    exports.TRACKER_ID = 'UA-9568575-2';
} else {
    exports.TRACKER_ID = 'UA-9568575-3';
}
exports.VK_PROTOCOL = 'https://';
exports.VK_BASE = exports.VK_PROTOCOL + 'vk.com/';
// HTTPS only
// @see http://vk.com/pages?oid=-1&p=%D0%92%D1%8B%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%BE%D0%B2_%D0%BA_API
exports.AUTH_DOMAIN = 'https://oauth.vk.com/';
exports.AUTH_URI = [
    exports.AUTH_DOMAIN,
    'authorize?',
    [
        'client_id=' + exports.APP_ID,
        'scope=friends,photos,audio,video,docs,notes,pages,wall,groups,messages,notifications',
        'response_type=token',
        'redirect_uri=' + encodeURIComponent('https://oauth.vk.com/blank.html'),
        'display=page'
    ].join('&')
].join('');

},{"env/env.js":8}],8:[function(require,module,exports){
/*jshint bitwise: false*/
var isPopup = typeof location !== 'undefined' && ~location.href.indexOf('popup');

module.exports = {
    popup: isPopup,
    background: !isPopup,
};

},{}],9:[function(require,module,exports){
var
MAX_ITEMS_COUNT = 50,
MAX_COMMENTS_COUNT = 3,
UPDATE_PERIOD = 2000, //ms

_ = require('underscore')._,
Vow = require('vow'),
Backbone = require('backbone'),
Request = require('request/request.bg.js'),
User = require('users/users.bg.js'),
Mediator = require('mediator/mediator.js'),
Router = require('router/router.bg.js'),
Browser = require('browser/browser.bg.js'),
I18N = require('i18n/i18n.js'),
PersistentModel = require('persistent-model/persistent-model.js'),
Notifications = require('notifications/notifications.bg.js'),
ProfilesCollection = require('profiles-collection/profiles-collection.bg.js'),

readyPromise = Vow.promise(),
persistentModel, userId,
autoUpdateNotificationsParams, autoUpdateCommentsParams,
profilesColl = new (ProfilesCollection.extend({
    model: Backbone.Model.extend({
        parse: function (profile) {
            if (profile.gid) {
                profile.id = -profile.gid;
            } else {
                profile.id = profile.uid;
            }
            return profile;
        }
    })
}))(),
fetchFeedbacksDebounced,
FeedbacksCollection = Backbone.Collection.extend({
    comparator: function (model) {
        return model.get('date');
    }
}),
itemsColl = new (Backbone.Collection.extend({
    comparator: function (model) {
        return -model.get('date');
    }
}))(),
/**
 * Notifies about current state of module.
 * Has a tiny debounce to make only one publish per event loop
 */
publishData = _.debounce(function publishData() {
    Mediator.pub('feedbacks:data', {
        profiles: profilesColl.toJSON(),
        items: itemsColl.toJSON()
    });
}, 0);
/**
 * Updates "latestFeedbackId" with current last item(parentId+feedbackId)
 * Should be called on every change
 */
function updateLatestFeedbackId() {
    var firstModel = itemsColl.first(), identifier;

    if (firstModel) {
        identifier = firstModel.get('id');

        if (firstModel.has('feedbacks')) {
            identifier += ':' + firstModel.get('feedbacks').last().get('id');
        }
        persistentModel.set('latestFeedbackId', identifier);
    }
}
/**
 * Generates uniq id for feedback item
 *
 * @param {String} type of parent: post, comments, topic etc
 * @param {Object} parent
 *
 * @return {String}
 */
function generateItemID(type, parent) {
    if (parent.owner_id) {
        return [
            // replace wall with post,
            // to make correct merging items from 'notifications.get' and 'newsfeed.getComments'
            type === 'wall' ? 'post':type,
            parent.id || parent.pid || parent.cid || parent.post_id,
            'user', parent.owner_id
        ].join(':');
    } else {
        return _.uniqueId(type);
    }
}
/**
 * Creates feedbacks item
 *
 * @param {String} type Type of parent: post, wall, topic, photo etc
 * @param {Object} parent
 * @param {Boolean} canHaveFeedbacks
 *
 * @return {Object}
 */
function createItemModel(type, parent) {
    var itemModel = new Backbone.Model({
        id: generateItemID(type, parent),
        parent: parent,
        type: type
    });
    return itemModel;
}

/**
 * Processes raw comments item and adds it to itemsColl,
 * doesn't sort itemsColl
 *
 * @param {Object} item
 */
function addRawCommentsItem(item) {
    var parentType = item.type,
    parent = item, itemModel, itemID, lastCommentDate;

    // do nothing if no comments
    if (!(item.comments.list && item.comments.list.length)) {
        return;
    }

    parent.owner_id = Number(parent.from_id || parent.source_id);
    itemID  = generateItemID(parentType, parent);
    if (!(itemModel = itemsColl.get(itemID))) {
        itemModel = createItemModel(parentType, parent);
        itemsColl.add(itemModel, {sort: false});
    }
    if (!itemModel.has('feedbacks')) {
        itemModel.set('feedbacks', new FeedbacksCollection());
    }
    itemModel.get('feedbacks').add(item.comments.list.slice(- MAX_COMMENTS_COUNT).map(function (feedback) {
        feedback.owner_id = Number(feedback.from_id);
        return {
            id: generateItemID('comment', feedback),
            type: 'comment',
            feedback: feedback,
            date: feedback.date
        };
    }));

    lastCommentDate = itemModel.get('feedbacks').last().get('date');
    if (!itemModel.has('date') || itemModel.get('date') < lastCommentDate) {
        itemModel.set('date', lastCommentDate);
    }

    itemModel.trigger('change');
}
/**
 * Returns true for supported feedback types
 * @param {String} type
 *
 * @returns {Boolean}
 */
function isSupportedType(type) {
    var forbidden = [
        'mention_comments',
        'reply_comment',
        'reply_comment_photo',
        'reply_comment_video',
        'reply_topic'
    ];

    return forbidden.indexOf(type) === -1;
}
/**
 * Handles news' item.
 * If parent is already in collection,
 * then adds feedback to parent's feedbacks collection.
 * Doesn't sort itemsColl
 *
 * @param {Object} item
 */
function addRawNotificationsItem(item) {
    var parentType, parent = item.parent,
    feedbackType, feedback = item.feedback,
    itemID, itemModel, typeTokens;

    if (!isSupportedType(item.type)) {
        return;
    }

    if (item.type === 'friend_accepted') {
        parentType = item.type;
        parent = item.feedback;
    } else if (item.type.indexOf('_') !== -1) {
        typeTokens = item.type.split('_');
        feedbackType = typeTokens[0];
        parentType = typeTokens[1];
    } else {
        parentType = item.type;
    }

    if (feedbackType) {
        parent.owner_id = Number(parent.from_id || parent.owner_id);
        itemID  = generateItemID(parentType, parent);
        if (!(itemModel = itemsColl.get(itemID))) {
            itemModel = createItemModel(parentType, parent);
            itemsColl.add(itemModel, {sort: false});
        }
        if (!itemModel.has('feedbacks')) {
            itemModel.set('feedbacks', new FeedbacksCollection());
        }
        itemModel.get('feedbacks').add([].concat(feedback).map(function (feedback) {
            var id;

            feedback.owner_id = Number(feedback.from_id || feedback.owner_id);

            if (feedbackType === 'like' || feedbackType === 'copy') {
                // 'like' and 'post', so we need to pass 'parent'
                // to make difference for two likes from the same user to different objects
                id  = generateItemID(feedbackType, parent);
            } else {
                id  = generateItemID(feedbackType, feedback);
            }
            return {
                id: id,
                type: feedbackType,
                feedback: feedback,
                date: item.date
            };
        }));
        if (!itemModel.has('date') || itemModel.get('date') < item.date) {
            itemModel.set('date', item.date);
        }
        itemModel.trigger('change');
    } else {
        //follows and friend_accepter types are array
        [].concat(feedback).forEach(function (feedback) {
            var itemModel;
            feedback.owner_id = Number(feedback.owner_id || feedback.from_id);
            itemModel = createItemModel(parentType, feedback);
            itemModel.set('date', item.date);
            itemsColl.add(itemModel, {sort: false});
        });
    }
}
function fetchFeedbacks() {
    Request.api({code: [
        'return {time: API.utils.getServerTime(),',
        ' notifications: API.notifications.get(',
        JSON.stringify(autoUpdateNotificationsParams), '),',
        ' comments: API.newsfeed.getComments(',
        JSON.stringify(autoUpdateCommentsParams), ')',
        '};'
    ].join('')}).done(function (response) {
        var notifications = response.notifications,
        comments = response.comments;

        autoUpdateNotificationsParams.start_time = response.time;
        autoUpdateCommentsParams.start_time = response.time;

        // first item in notifications contains quantity
        if ((notifications.items && notifications.items.length > 1)
            || (comments.items && comments.items.length)) {
            profilesColl
                .add(comments.profiles, {parse: true})
                .add(comments.groups, {parse: true})
                .add(notifications.profiles, {parse: true})
                .add(notifications.groups, {parse: true});

            notifications.items.slice(1).forEach(addRawNotificationsItem);
            comments.items.forEach(addRawCommentsItem);
            itemsColl.sort();
        }
        readyPromise.fulfill();
        fetchFeedbacksDebounced();
    });
}
fetchFeedbacksDebounced = _.debounce(fetchFeedbacks, UPDATE_PERIOD);


function tryNotification() {
    var itemModel = itemsColl.first(),
    lastFeedback, notificationItem, type, parentType,
    profile, ownerId, gender, title, message, name;

    // don't notify on first run,
    // when there is no previous value
    if (!this._previousAttributes.hasOwnProperty('latestFeedbackId')) {
        return;
    }

    if (itemModel.has('feedbacks')) { // notification has parent, e.g. comment to post, like to video etc
        lastFeedback = itemModel.get('feedbacks').last();
        notificationItem = lastFeedback.get('feedback');
        type = lastFeedback.get('type');
        parentType = itemModel.get('type');
    } else { // notification is parent itself, e.g. wall post, friend request etc
        notificationItem = itemModel.get('parent');
        type = itemModel.get('type');
    }

    ownerId = notificationItem.owner_id;

    // Don't show self messages
    if (ownerId !== userId) {
        try {
            profile = profilesColl.get(ownerId).toJSON();
            name = User.getName(profile);
            gender = profile.sex === 1 ? 'female':'male';
        } catch (e) {
            console.log(ownerId, profile, name);
            throw e;
        }

        switch (type) {
            case 'friend_accepted':
                title = name + ' ' + I18N.get('friend request accepted', {
                    GENDER: gender
                });
                break;
            case 'follow':
                title = name + ' ' + I18N.get('started following you', {
                    GENDER: gender
                });
                break;
            case 'mention':
                title = name + ' ' + I18N.get('mentioned you', {
                    GENDER: gender
                });
                message = notificationItem.text;
                break;
            case 'wall':
                title = name + ' ' + I18N.get('posted on your wall', {
                    GENDER: gender
                });
                message = notificationItem.text;
                break;
            case 'like':
                title = name + ' ' + I18N.get('liked your ' + parentType, {
                    GENDER: gender
                });
                break;
            case 'copy':
                title = name + ' ' + I18N.get('shared your ' + parentType, {
                    GENDER: gender
                });
                break;
            case 'comment':
                // 'mention_commentS' type in notifications
            case 'comments':
            case 'reply':
                title = I18N.get('left a comment', {
                    NAME: name,
                    GENDER: gender
                });
                message = notificationItem.text;
                break;
        }

        if (title) {
            // Don't notify, when active tab is vk.com
            Browser.isVKSiteActive().then(function (active) {
                var feedbacksActive = Browser.isPopupOpened()
                    && Router.isFeedbackTabActive();

                if (!active) {
                    Notifications.notify({
                        type: Notifications.NEWS,
                        title: title,
                        message: message,
                        image: profile.photo,
                        noBadge: feedbacksActive,
                        noPopup: feedbacksActive
                    });
                }
            }).done();
        }
    }
}
/**
 * Initialize all variables
 */
function initialize() {
    if (!readyPromise || readyPromise.isFulfilled()) {
        if (readyPromise) {
            readyPromise.reject();
        }
        readyPromise = Vow.promise();
    }
    readyPromise.then(function () {
        persistentModel = new PersistentModel({}, {
            name: ['feedbacks', 'background', userId].join(':')
        });
        persistentModel.on('change:latestFeedbackId', tryNotification);

        updateLatestFeedbackId();
        publishData();
    }).done();

    autoUpdateNotificationsParams = {
        count: MAX_ITEMS_COUNT
    };
    autoUpdateCommentsParams = {
        last_comments: 1,
        count: MAX_ITEMS_COUNT
    };
    itemsColl.reset();
    profilesColl.reset();
    fetchFeedbacks();
}

// entry point
Mediator.sub('auth:success', function (data) {
    userId = data.userId;
    initialize();
});

readyPromise.then(function () {
    itemsColl.on('add change remove', _.debounce(function () {
        itemsColl.sort();
        updateLatestFeedbackId();
        publishData();
    }));
    profilesColl.on('change', publishData);
}).done();

Mediator.sub('likes:changed', function (params) {
    var changedItemUniqueId = [
        params.type, params.item_id,
        'user', params.owner_id
    ].join(':'), changedModel = itemsColl.get(changedItemUniqueId);

    if (changedModel) {
        changedModel.get('parent').likes = params.likes;
        itemsColl.trigger('change');
    }
});

Mediator.sub('feedbacks:unsubscribe', function (params) {
    var unsubscribeFromId = [
        params.type, params.item_id,
        'user', params.owner_id
    ].join(':');

    Request.api({
        code: 'return API.newsfeed.unsubscribe('
            + JSON.stringify(params)
    + ');'
    }).then(function (response) {
        if (response) {
            itemsColl.remove(itemsColl.get(unsubscribeFromId));
        }
    });
});

Mediator.sub('feedbacks:data:get', function () {
    readyPromise.then(publishData).done();
});

},{"backbone":32,"browser/browser.bg.js":4,"i18n/i18n.js":12,"mediator/mediator.js":18,"notifications/notifications.bg.js":20,"persistent-model/persistent-model.js":22,"profiles-collection/profiles-collection.bg.js":24,"request/request.bg.js":25,"router/router.bg.js":27,"underscore":35,"users/users.bg.js":31,"vow":36}],10:[function(require,module,exports){
var MARK_PERIOD = 5 * 60 * 1000, //5 min

    Mediator = require('mediator/mediator.js'),
    Request = require('request/request.bg.js'),
    PersistentModel = require('persistent-model/persistent-model.js'),

    timeoutId, settings = new PersistentModel({
        enabled: false
    }, {name: 'forceOnline'});

Mediator.sub('forceOnline:settings:get', function () {
    Mediator.pub('forceOnline:settings', settings.toJSON());
});
Mediator.sub('forceOnline:settings:put', function (data) {
    settings.set(data);
});

function markAsOnline() {
    clearTimeout(timeoutId);
    Request.api({code: 'return API.account.setOnline();'});
    timeoutId = setTimeout(markAsOnline, MARK_PERIOD);
}

if (settings.get('enabled')) {
    markAsOnline();
}

settings.on('change:enabled', function (event, enabled) {
    if (enabled) {
        markAsOnline();
    } else {
        clearTimeout(timeoutId);
    }
});

},{"mediator/mediator.js":18,"persistent-model/persistent-model.js":22,"request/request.bg.js":25}],11:[function(require,module,exports){
(function(){ module.exports || (module.exports = {}) 
var MessageFormat = { locale: {} };
MessageFormat.locale.en = function ( n ) {
  if ( n === 1 ) {
    return "one";
  }
  return "other";
};

module.exports["en"] = {}
module.exports["en"]["chat"] = function(d){
var r = "";
r += "chat";
return r;
}
module.exports["en"]["news"] = function(d){
var r = "";
r += "news";
return r;
}
module.exports["en"]["buddies"] = function(d){
var r = "";
r += "buddies";
return r;
}
module.exports["en"]["my"] = function(d){
var r = "";
r += "my";
return r;
}
module.exports["en"]["friends_nominative"] = function(d){
var r = "";
r += "friends";
return r;
}
module.exports["en"]["groups_nominative"] = function(d){
var r = "";
r += "groups";
return r;
}
module.exports["en"]["Private message"] = function(d){
var r = "";
r += "Private message";
return r;
}
module.exports["en"]["Wall post"] = function(d){
var r = "";
r += "Wall post";
return r;
}
module.exports["en"]["Search"] = function(d){
var r = "";
r += "First or last name";
return r;
}
module.exports["en"]["Male"] = function(d){
var r = "";
r += "Male";
return r;
}
module.exports["en"]["Female"] = function(d){
var r = "";
r += "Female";
return r;
}
module.exports["en"]["Offline"] = function(d){
var r = "";
r += "Offline";
return r;
}
module.exports["en"]["Bookmarked"] = function(d){
var r = "";
r += "Bookmarked";
return r;
}
module.exports["en"]["Monitor online status"] = function(d){
var r = "";
r += "Monitor online status";
return r;
}
module.exports["en"]["Mark as read"] = function(d){
var r = "";
r += "Mark as read";
return r;
}
module.exports["en"]["Your message wasn't read"] = function(d){
var r = "";
r += "Your message wasn't read";
return r;
}
module.exports["en"]["Like"] = function(d){
var r = "";
r += "Like";
return r;
}
module.exports["en"]["Show history"] = function(d){
var r = "";
r += "Show history";
return r;
}
module.exports["en"]["Open in New Tab"] = function(d){
var r = "";
r += "Open in New Tab";
return r;
}
module.exports["en"]["unsubscribe"] = function(d){
var r = "";
r += "unsubscribe";
return r;
}
module.exports["en"]["more..."] = function(d){
var r = "";
r += "more";
return r;
}
module.exports["en"]["Comment"] = function(d){
var r = "";
r += "Comment";
return r;
}
module.exports["en"]["Liked"] = function(d){
var r = "";
r += "Liked";
return r;
}
module.exports["en"]["Reposted"] = function(d){
var r = "";
r += "Reposted";
return r;
}
module.exports["en"]["New friends:"] = function(d){
var r = "";
r += "New friends:";
return r;
}
module.exports["en"]["started following you"] = function(d){
var r = "";
r += "started following you";
return r;
}
module.exports["en"]["friend request accepted"] = function(d){
var r = "";
r += "friend request accepted";
return r;
}
module.exports["en"]["sent a message"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
r += d["NAME"];
r += " sent a message";
return r;
}
module.exports["en"]["is online"] = function(d){
var r = "";
r += "is online";
return r;
}
module.exports["en"]["is_online_short"] = function(d){
var r = "";
r += "appeared";
return r;
}
module.exports["en"]["went offline"] = function(d){
var r = "";
r += "went offline";
return r;
}
module.exports["en"]["went_offline_short"] = function(d){
var r = "";
r += "went";
return r;
}
module.exports["en"]["left a comment"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
r += d["NAME"];
r += " left a comment";
return r;
}
module.exports["en"]["mentioned you"] = function(d){
var r = "";
r += "mentioned you";
return r;
}
module.exports["en"]["posted on your wall"] = function(d){
var r = "";
r += "posted on your wall";
return r;
}
module.exports["en"]["liked your comment"] = function(d){
var r = "";
r += "liked your comment";
return r;
}
module.exports["en"]["liked your post"] = function(d){
var r = "";
r += "liked your post";
return r;
}
module.exports["en"]["liked your photo"] = function(d){
var r = "";
r += "liked your photo";
return r;
}
module.exports["en"]["liked your video"] = function(d){
var r = "";
r += "liked your video";
return r;
}
module.exports["en"]["shared your post"] = function(d){
var r = "";
r += "shared your post";
return r;
}
module.exports["en"]["shared your photo"] = function(d){
var r = "";
r += "shared your photo";
return r;
}
module.exports["en"]["shared your video"] = function(d){
var r = "";
r += "shared your video";
return r;
}
module.exports["en"]["notifications"] = function(d){
var r = "";
r += "notifications";
return r;
}
module.exports["en"]["force online"] = function(d){
var r = "";
r += "Be always online";
return r;
}
module.exports["en"]["sound"] = function(d){
var r = "";
r += "sound";
return r;
}
module.exports["en"]["signal"] = function(d){
var r = "";
r += "signal";
return r;
}
module.exports["en"]["volume"] = function(d){
var r = "";
r += "volume";
return r;
}
module.exports["en"]["popups"] = function(d){
var r = "";
r += "popups";
return r;
}
module.exports["en"]["show text"] = function(d){
var r = "";
r += "show message text";
return r;
}
module.exports["en"]["show all"] = function(d){
var r = "";
r += "show all";
return r;
}
module.exports["en"]["hide"] = function(d){
var r = "";
r += "show less";
return r;
}
module.exports["en"]["Yandex search"] = function(d){
var r = "";
r += "Yandex search";
return r;
}
module.exports["en"]["install_noun"] = function(d){
var r = "";
r += "install";
return r;
}
module.exports["en"]["install_verb"] = function(d){
var r = "";
r += "install";
return r;
}
module.exports["en"]["skip"] = function(d){
var r = "";
r += "skip";
return r;
}
module.exports["en"]["login"] = function(d){
var r = "";
r += "login";
return r;
}
module.exports["en"]["accept"] = function(d){
var r = "";
r += "accept";
return r;
}
module.exports["en"]["no"] = function(d){
var r = "";
r += "no";
return r;
}
module.exports["en"]["close"] = function(d){
var r = "";
r += "close";
return r;
}
module.exports["en"]["Authorize VKfox with Vkontakte"] = function(d){
var r = "";
r += "First you need to authorize VKfox to connect with VK.COM™. If you are doing this for the first time you will be asked to grant access to your account.";
return r;
}
module.exports["en"]["Accept license agreement"] = function(d){
var r = "";
r += "By installing this application you agree to all terms, conditions, and information of the <a anchor='http://vkfox.org.ua/license'>license agreement.</a>";
return r;
}
module.exports["en"]["Install Yandex search"] = function(d){
var r = "";
r += "Please consider supporting future development of VKfox by installing Yandex search.";
return r;
}
module.exports["en"]["Thank you!"] = function(d){
var r = "";
r += "Thank you, installation is complete! Now this window can be closed.";
return r;
}
})();

},{}],12:[function(require,module,exports){
var DEFAULT_LANGUAGE = 'ru',

    _ = require('underscore')._,

    i18n = _.extend(
        {},
        require('./ru.js'),
        require('./uk.js'),
        require('./en.js')
    ), language, messages;

try {
    // language = navigator.language.split('-')[0].toLowerCase();
} catch (e) {}

if (!i18n[language]) {
    language = DEFAULT_LANGUAGE;
}

messages = i18n[language];

module.exports = {
    /**
     * Returns current browser language
     *
     * @returns {String}
     */
    getLang: function () {
        return language;
    },
    /**
     * Returns localized text
     *
     * @param [String] key
     * @param [...Mixed] any number of params
     *
     * @returns {String}
     */
    get: function (key) {
        return messages[key].apply(
            messages,
            [].slice.call(arguments, 1)
        );
    }
};

},{"./en.js":11,"./ru.js":13,"./uk.js":14,"underscore":35}],13:[function(require,module,exports){
(function(){ module.exports || (module.exports = {}) 
var MessageFormat = { locale: {} };
MessageFormat.locale.ru = function (n) {
  if ((n % 10) == 1 && (n % 100) != 11) {
    return 'one';
  }
  if ((n % 10) >= 2 && (n % 10) <= 4 &&
      ((n % 100) < 12 || (n % 100) > 14) && n == Math.floor(n)) {
    return 'few';
  }
  if ((n % 10) === 0 || ((n % 10) >= 5 && (n % 10) <= 9) ||
      ((n % 100) >= 11 && (n % 100) <= 14) && n == Math.floor(n)) {
    return 'many';
  }
  return 'other';
};

module.exports["ru"] = {}
module.exports["ru"]["chat"] = function(d){
var r = "";
r += "чат";
return r;
}
module.exports["ru"]["news"] = function(d){
var r = "";
r += "новости";
return r;
}
module.exports["ru"]["buddies"] = function(d){
var r = "";
r += "люди";
return r;
}
module.exports["ru"]["my"] = function(d){
var r = "";
r += "мои";
return r;
}
module.exports["ru"]["friends_nominative"] = function(d){
var r = "";
r += "друзей";
return r;
}
module.exports["ru"]["groups_nominative"] = function(d){
var r = "";
r += "групп";
return r;
}
module.exports["ru"]["Private message"] = function(d){
var r = "";
r += "Личное сообщение";
return r;
}
module.exports["ru"]["Wall post"] = function(d){
var r = "";
r += "Сообщение на стене";
return r;
}
module.exports["ru"]["Search"] = function(d){
var r = "";
r += "Имя или Фамилия";
return r;
}
module.exports["ru"]["Male"] = function(d){
var r = "";
r += "Мужчины";
return r;
}
module.exports["ru"]["Female"] = function(d){
var r = "";
r += "Женщины";
return r;
}
module.exports["ru"]["Offline"] = function(d){
var r = "";
r += "Не в сети";
return r;
}
module.exports["ru"]["Bookmarked"] = function(d){
var r = "";
r += "В закладках";
return r;
}
module.exports["ru"]["Monitor online status"] = function(d){
var r = "";
r += "Следить за онлайн статусом";
return r;
}
module.exports["ru"]["Mark as read"] = function(d){
var r = "";
r += "Отметить прочитанным";
return r;
}
module.exports["ru"]["Your message wasn't read"] = function(d){
var r = "";
r += "Ваше сообщение не прочитано";
return r;
}
module.exports["ru"]["Like"] = function(d){
var r = "";
r += "Нравится";
return r;
}
module.exports["ru"]["Show history"] = function(d){
var r = "";
r += "Показать историю";
return r;
}
module.exports["ru"]["Open in New Tab"] = function(d){
var r = "";
r += "Открыть в новом окне";
return r;
}
module.exports["ru"]["unsubscribe"] = function(d){
var r = "";
r += "отписаться";
return r;
}
module.exports["ru"]["more..."] = function(d){
var r = "";
r += "далee";
return r;
}
module.exports["ru"]["Comment"] = function(d){
var r = "";
r += "Комментировать";
return r;
}
module.exports["ru"]["Liked"] = function(d){
var r = "";
r += "Понравилось";
return r;
}
module.exports["ru"]["Reposted"] = function(d){
var r = "";
r += "Поделился записью";
return r;
}
module.exports["ru"]["New friends:"] = function(d){
var r = "";
r += "Новые друзья:";
return r;
}
module.exports["ru"]["started following you"] = function(d){
var r = "";
r += "хочет добавить в друзья";
return r;
}
module.exports["ru"]["friend request accepted"] = function(d){
var r = "";
r += "заявка в друзья подтверждена";
return r;
}
module.exports["ru"]["sent a message"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
r += d["NAME"];
r += " ";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "прислал";
return r;
},
"female" : function(d){
var r = "";
r += "прислала";
return r;
},
"other" : function(d){
var r = "";
r += "прислал";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " сообщение";
return r;
}
module.exports["ru"]["is online"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "появился";
return r;
},
"female" : function(d){
var r = "";
r += "появилась";
return r;
},
"other" : function(d){
var r = "";
r += "появился";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " в сети";
return r;
}
module.exports["ru"]["is_online_short"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "появился";
return r;
},
"female" : function(d){
var r = "";
r += "появилась";
return r;
},
"other" : function(d){
var r = "";
r += "появился";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
return r;
}
module.exports["ru"]["went offline"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "вышел";
return r;
},
"female" : function(d){
var r = "";
r += "вышла";
return r;
},
"other" : function(d){
var r = "";
r += "вышел";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " из сети";
return r;
}
module.exports["ru"]["went_offline_short"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "вышел";
return r;
},
"female" : function(d){
var r = "";
r += "вышла";
return r;
},
"other" : function(d){
var r = "";
r += "вышел";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
return r;
}
module.exports["ru"]["left a comment"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
r += d["NAME"];
r += " ";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "оставил";
return r;
},
"female" : function(d){
var r = "";
r += "оставила";
return r;
},
"other" : function(d){
var r = "";
r += "оставил";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " комментарий";
return r;
}
module.exports["ru"]["mentioned you"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "упомянул";
return r;
},
"female" : function(d){
var r = "";
r += "упомянула";
return r;
},
"other" : function(d){
var r = "";
r += "упомянул";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вас";
return r;
}
module.exports["ru"]["posted on your wall"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "написал";
return r;
},
"female" : function(d){
var r = "";
r += "написала";
return r;
},
"other" : function(d){
var r = "";
r += "написал";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " на стене";
return r;
}
module.exports["ru"]["liked your comment"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "оценил";
return r;
},
"female" : function(d){
var r = "";
r += "оценила";
return r;
},
"other" : function(d){
var r = "";
r += "оценил";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " ваш комментарий";
return r;
}
module.exports["ru"]["liked your post"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "оценил";
return r;
},
"female" : function(d){
var r = "";
r += "оценила";
return r;
},
"other" : function(d){
var r = "";
r += "оценил";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вашу запись";
return r;
}
module.exports["ru"]["liked your photo"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "оценил";
return r;
},
"female" : function(d){
var r = "";
r += "оценила";
return r;
},
"other" : function(d){
var r = "";
r += "оценил";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " ваше фото";
return r;
}
module.exports["ru"]["liked your video"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "оценил";
return r;
},
"female" : function(d){
var r = "";
r += "оценила";
return r;
},
"other" : function(d){
var r = "";
r += "оценил";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " ваше видео";
return r;
}
module.exports["ru"]["shared your post"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "поделился";
return r;
},
"female" : function(d){
var r = "";
r += "поделилась";
return r;
},
"other" : function(d){
var r = "";
r += "поделился";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вашей записью";
return r;
}
module.exports["ru"]["shared your photo"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "поделился";
return r;
},
"female" : function(d){
var r = "";
r += "поделилась";
return r;
},
"other" : function(d){
var r = "";
r += "поделился";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вашим фото";
return r;
}
module.exports["ru"]["shared your video"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "поделился";
return r;
},
"female" : function(d){
var r = "";
r += "поделилась";
return r;
},
"other" : function(d){
var r = "";
r += "поделился";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вашим видео";
return r;
}
module.exports["ru"]["notifications"] = function(d){
var r = "";
r += "уведомления";
return r;
}
module.exports["ru"]["force online"] = function(d){
var r = "";
r += "быть всегда он-лайн";
return r;
}
module.exports["ru"]["sound"] = function(d){
var r = "";
r += "звук";
return r;
}
module.exports["ru"]["signal"] = function(d){
var r = "";
r += "сигнал";
return r;
}
module.exports["ru"]["volume"] = function(d){
var r = "";
r += "громкость";
return r;
}
module.exports["ru"]["popups"] = function(d){
var r = "";
r += "всплывающие окна";
return r;
}
module.exports["ru"]["show text"] = function(d){
var r = "";
r += "показывать текст";
return r;
}
module.exports["ru"]["show all"] = function(d){
var r = "";
r += "показать все";
return r;
}
module.exports["ru"]["hide"] = function(d){
var r = "";
r += "скрыть";
return r;
}
module.exports["ru"]["Yandex search"] = function(d){
var r = "";
r += "Яндекс поиск";
return r;
}
module.exports["ru"]["install_noun"] = function(d){
var r = "";
r += "установка";
return r;
}
module.exports["ru"]["install_verb"] = function(d){
var r = "";
r += "установить";
return r;
}
module.exports["ru"]["skip"] = function(d){
var r = "";
r += "пропустить";
return r;
}
module.exports["ru"]["login"] = function(d){
var r = "";
r += "авторизовать";
return r;
}
module.exports["ru"]["accept"] = function(d){
var r = "";
r += "принять";
return r;
}
module.exports["ru"]["no"] = function(d){
var r = "";
r += "нет";
return r;
}
module.exports["ru"]["close"] = function(d){
var r = "";
r += "закрыть";
return r;
}
module.exports["ru"]["Authorize VKfox with Vkontakte"] = function(d){
var r = "";
r += "Прежде всего, необходимо авторизироваться в VKfox. Если вы это делаете в первые вам будет необходимо разрешить доступ к вашей странице.";
return r;
}
module.exports["ru"]["Accept license agreement"] = function(d){
var r = "";
r += "Устанавливая данное приложение вы тем самым соглашаетесь со всеми правилами, условиями и информацией нашего <a anchor='http://vkfox.org.ua/license'>лицензионного соглашения.</a>";
return r;
}
module.exports["ru"]["Install Yandex search"] = function(d){
var r = "";
r += "Пожалуйста, поддержите дальнейшее развитие VKfox и установите новый Яндекс поиск.";
return r;
}
module.exports["ru"]["Thank you!"] = function(d){
var r = "";
r += "Спасибо, установка приложения окончена. Окно может быть закрыто.";
return r;
}
})();

},{}],14:[function(require,module,exports){
(function(){ module.exports || (module.exports = {}) 
var MessageFormat = { locale: {} };
MessageFormat.locale.uk = function (n) {
  if ((n % 10) == 1 && (n % 100) != 11) {
    return 'one';
  }
  if ((n % 10) >= 2 && (n % 10) <= 4 &&
      ((n % 100) < 12 || (n % 100) > 14) && n == Math.floor(n)) {
    return 'few';
  }
  if ((n % 10) === 0 || ((n % 10) >= 5 && (n % 10) <= 9) ||
      ((n % 100) >= 11 && (n % 100) <= 14) && n == Math.floor(n)) {
    return 'many';
  }
  return 'other';
};

module.exports["uk"] = {}
module.exports["uk"]["chat"] = function(d){
var r = "";
r += "чат";
return r;
}
module.exports["uk"]["news"] = function(d){
var r = "";
r += "новини";
return r;
}
module.exports["uk"]["buddies"] = function(d){
var r = "";
r += "люди";
return r;
}
module.exports["uk"]["my"] = function(d){
var r = "";
r += "мої";
return r;
}
module.exports["uk"]["friends_nominative"] = function(d){
var r = "";
r += "друзів";
return r;
}
module.exports["uk"]["groups_nominative"] = function(d){
var r = "";
r += "груп";
return r;
}
module.exports["uk"]["Private message"] = function(d){
var r = "";
r += "Особисте повідомлення";
return r;
}
module.exports["uk"]["Wall post"] = function(d){
var r = "";
r += "Повідомлення на стіні";
return r;
}
module.exports["uk"]["Search"] = function(d){
var r = "";
r += "Ім'я або Прізвище";
return r;
}
module.exports["uk"]["Male"] = function(d){
var r = "";
r += "Чоловіки";
return r;
}
module.exports["uk"]["Female"] = function(d){
var r = "";
r += "Жінки";
return r;
}
module.exports["uk"]["Offline"] = function(d){
var r = "";
r += "Не в мережі";
return r;
}
module.exports["uk"]["Bookmarked"] = function(d){
var r = "";
r += "У закладках";
return r;
}
module.exports["uk"]["Monitor online status"] = function(d){
var r = "";
r += "Слідкувати за онлайн статусом";
return r;
}
module.exports["uk"]["Mark as read"] = function(d){
var r = "";
r += "Відзначити прочитаним";
return r;
}
module.exports["uk"]["Your message wasn't read"] = function(d){
var r = "";
r += "Ваше повідомлення не прочитано";
return r;
}
module.exports["uk"]["Like"] = function(d){
var r = "";
r += "Подобається";
return r;
}
module.exports["uk"]["Show history"] = function(d){
var r = "";
r += "Показати історію";
return r;
}
module.exports["uk"]["Open in New Tab"] = function(d){
var r = "";
r += "Відкрити у новому вікні";
return r;
}
module.exports["uk"]["unsubscribe"] = function(d){
var r = "";
r += "відписатися";
return r;
}
module.exports["uk"]["more..."] = function(d){
var r = "";
r += "далі";
return r;
}
module.exports["uk"]["Comment"] = function(d){
var r = "";
r += "Коментувати";
return r;
}
module.exports["uk"]["Liked"] = function(d){
var r = "";
r += "Сподобалось";
return r;
}
module.exports["uk"]["Reposted"] = function(d){
var r = "";
r += "Поділився записом";
return r;
}
module.exports["uk"]["New friends:"] = function(d){
var r = "";
r += "Нові друзі:";
return r;
}
module.exports["uk"]["started following you"] = function(d){
var r = "";
r += "хоче додати у друзі";
return r;
}
module.exports["uk"]["friend request accepted"] = function(d){
var r = "";
r += "заявка у друзі підтверджена";
return r;
}
module.exports["uk"]["sent a message"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
r += d["NAME"];
r += " ";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "надіслав";
return r;
},
"female" : function(d){
var r = "";
r += "надіслала";
return r;
},
"other" : function(d){
var r = "";
r += "надіслав";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " повідомлення";
return r;
}
module.exports["uk"]["is online"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "з'явився";
return r;
},
"female" : function(d){
var r = "";
r += "з'явилася";
return r;
},
"other" : function(d){
var r = "";
r += "з'явився";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " в мережі";
return r;
}
module.exports["uk"]["is_online_short"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "з'явився";
return r;
},
"female" : function(d){
var r = "";
r += "з'явилася";
return r;
},
"other" : function(d){
var r = "";
r += "з'явився";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
return r;
}
module.exports["uk"]["went offline"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "вийшов";
return r;
},
"female" : function(d){
var r = "";
r += "вийшла";
return r;
},
"other" : function(d){
var r = "";
r += "вийшов";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " з мережі";
return r;
}
module.exports["uk"]["went_offline_short"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "вийшов";
return r;
},
"female" : function(d){
var r = "";
r += "вийшла";
return r;
},
"other" : function(d){
var r = "";
r += "вийшов";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
return r;
}
module.exports["uk"]["left a comment"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
r += d["NAME"];
r += " ";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "залишив";
return r;
},
"female" : function(d){
var r = "";
r += "залишила";
return r;
},
"other" : function(d){
var r = "";
r += "залишив";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " коментар";
return r;
}
module.exports["uk"]["mentioned you"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "згадав";
return r;
},
"female" : function(d){
var r = "";
r += "згадала";
return r;
},
"other" : function(d){
var r = "";
r += "згадав";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вас";
return r;
}
module.exports["uk"]["posted on your wall"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "написав";
return r;
},
"female" : function(d){
var r = "";
r += "написала";
return r;
},
"other" : function(d){
var r = "";
r += "написав";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " на стіні";
return r;
}
module.exports["uk"]["liked your comment"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "оцінив";
return r;
},
"female" : function(d){
var r = "";
r += "оцінила";
return r;
},
"other" : function(d){
var r = "";
r += "оцінив";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " ваш коментар";
return r;
}
module.exports["uk"]["liked your post"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "оцінив";
return r;
},
"female" : function(d){
var r = "";
r += "оцінила";
return r;
},
"other" : function(d){
var r = "";
r += "оцінив";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вашу запис";
return r;
}
module.exports["uk"]["liked your photo"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "оцінив";
return r;
},
"female" : function(d){
var r = "";
r += "оцінила";
return r;
},
"other" : function(d){
var r = "";
r += "оцінив";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " ваше фото";
return r;
}
module.exports["uk"]["liked your video"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "оцінив";
return r;
},
"female" : function(d){
var r = "";
r += "оцінила";
return r;
},
"other" : function(d){
var r = "";
r += "оцінив";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " ваше відео";
return r;
}
module.exports["uk"]["shared your post"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "поділився";
return r;
},
"female" : function(d){
var r = "";
r += "поділилася";
return r;
},
"other" : function(d){
var r = "";
r += "поділився";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вашим записом";
return r;
}
module.exports["uk"]["shared your photo"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "поділився";
return r;
},
"female" : function(d){
var r = "";
r += "поділилася";
return r;
},
"other" : function(d){
var r = "";
r += "поділився";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вашим фото";
return r;
}
module.exports["uk"]["shared your video"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "поділився";
return r;
},
"female" : function(d){
var r = "";
r += "поділилася";
return r;
},
"other" : function(d){
var r = "";
r += "поділився";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вашим відео";
return r;
}
module.exports["uk"]["notifications"] = function(d){
var r = "";
r += "повідомлення";
return r;
}
module.exports["uk"]["force online"] = function(d){
var r = "";
r += "бути завжди он-лайн";
return r;
}
module.exports["uk"]["sound"] = function(d){
var r = "";
r += "звук";
return r;
}
module.exports["uk"]["signal"] = function(d){
var r = "";
r += "сигнал";
return r;
}
module.exports["uk"]["volume"] = function(d){
var r = "";
r += "гучність";
return r;
}
module.exports["uk"]["popups"] = function(d){
var r = "";
r += "спливаючі вікна";
return r;
}
module.exports["uk"]["show all"] = function(d){
var r = "";
r += "показати усе";
return r;
}
module.exports["uk"]["hide"] = function(d){
var r = "";
r += "приховати";
return r;
}
module.exports["uk"]["show text"] = function(d){
var r = "";
r += "показувати текст";
return r;
}
module.exports["uk"]["Yandex search"] = function(d){
var r = "";
r += "Яндекс пошук";
return r;
}
module.exports["uk"]["install_noun"] = function(d){
var r = "";
r += "установка";
return r;
}
module.exports["uk"]["install_verb"] = function(d){
var r = "";
r += "встановити";
return r;
}
module.exports["uk"]["skip"] = function(d){
var r = "";
r += "пропустити";
return r;
}
module.exports["uk"]["login"] = function(d){
var r = "";
r += "авторизувати";
return r;
}
module.exports["uk"]["accept"] = function(d){
var r = "";
r += "прийняти";
return r;
}
module.exports["uk"]["no"] = function(d){
var r = "";
r += "ні";
return r;
}
module.exports["uk"]["close"] = function(d){
var r = "";
r += "закрити";
return r;
}
module.exports["uk"]["Authorize VKfox with Vkontakte"] = function(d){
var r = "";
r += "Перш за все, необхідно авторизуватися у VKfox. Якщо ви це робите у перше, вам буде необхідно дозволити доступ до вашої сторінки.";
return r;
}
module.exports["uk"]["Accept license agreement"] = function(d){
var r = "";
r += "Встановлюючи даний додаток ви погоджуєтесь з усіма правилами, умовами та інформацією нашої <a anchor='http: //vkfox.org.ua/license'>ліцензійної угоди.</a>";
return r;
}
module.exports["uk"]["Install Yandex search"] = function(d){
var r = "";
r += "Будь ласка, підтримайте подальший розвиток VKfox та встановіть новий Яндекс пошук.";
return r;
}
module.exports["uk"]["Thank you!"] = function(d){
var r = "";
r += "Дякуємо, установка додатку закінчена. Вікно може бути закрито.";
return r;
}
})();

},{}],15:[function(require,module,exports){
var LONG_POLL_WAIT = 20,
    FETCH_DEBOUNCE = 1000,
    fetchUpdates,

    _ = require('underscore')._,
    Request = require('request/request.bg.js'),
    Mediator = require('mediator/mediator.js');

function enableLongPollUpdates() {
    Request.api({
        code: 'return API.messages.getLongPollServer();'
    }).then(fetchUpdates);
}
fetchUpdates = _.debounce(function (params) {
    Request.get('http://' + params.server, {
        act: 'a_check',
        key:  params.key,
        ts: params.ts,
        wait: LONG_POLL_WAIT,
        mode: 2
    }, 'json').then(function (response) {
        if (!response.updates) {
            enableLongPollUpdates();
            return;
        } else if (response.updates.length) {
            Mediator.pub('longpoll:updates', response.updates);
        }

        params.ts = response.ts;
        fetchUpdates(params);
    }, enableLongPollUpdates).done();
}, FETCH_DEBOUNCE);

Mediator.sub('auth:success', function () {
    enableLongPollUpdates();
});

},{"mediator/mediator.js":18,"request/request.bg.js":25,"underscore":35}],16:[function(require,module,exports){
var _ = require('underscore')._,
    Backbone = require('backbone'),
    dispatcher = _.clone(Backbone.Events);

module.exports = {
    pub: function () {
        dispatcher.trigger.apply(dispatcher, arguments);
    },
    sub: function () {
        dispatcher.on.apply(dispatcher, arguments);
    },
    once: function () {
        dispatcher.once.apply(dispatcher, arguments);
    },
    unsub: function () {
        dispatcher.off.apply(dispatcher, arguments);
    }
};

},{"backbone":32,"underscore":35}],17:[function(require,module,exports){
var Dispatcher = require('./dispatcher.js'),
    Mediator = Object.create(Dispatcher),
    Browser = require('browser/browser.bg.js'),
    Env = require('env/env.js');

if (Env.firefox) {
    var browserAction = Browser.getBrowserAction();

    Object.defineProperty(Mediator, 'pub', { value: function () {
        Dispatcher.pub.apply(Mediator, arguments);
        browserAction.sendMessage([].slice.call(arguments));
    }, writable: true, enumerable: true});

    browserAction.onMessage.addListener(function (messageData) {
        console.log('recieve', messageData);
        Dispatcher.pub.apply(Mediator, messageData);
    });
} else {
    var activePorts = [];

    chrome.runtime.onConnect.addListener(function (port) {
        activePorts.push(port);
        port.onMessage.addListener(function (messageData) {
            Dispatcher.pub.apply(Mediator, messageData);
        });
        port.onDisconnect.addListener(function () {
            activePorts = activePorts.filter(function (active) {
                return active !== port;
            });
        });
    });

    Mediator.pub = function () {
        var args = arguments;
        Dispatcher.pub.apply(Mediator, args);

        activePorts.forEach(function (port) {
            port.postMessage([].slice.call(args));
        });
    };
}

module.exports = Mediator;

},{"./dispatcher.js":16,"browser/browser.bg.js":4,"env/env.js":8}],18:[function(require,module,exports){
/**
 * Returns a correct implementation
 * for background or popup page
 */
if (require('env/env.js').popup) {
    module.exports = require('./mediator.pu.js');
} else {
    module.exports = require('./mediator.bg.js');
}

},{"./mediator.bg.js":17,"./mediator.pu.js":33,"env/env.js":8}],19:[function(require,module,exports){
var
MAX_ITEMS_COUNT = 50,
UPDATE_PERIOD = 10000, //ms

_ = require('underscore')._,
Vow = require('vow'),
Backbone = require('backbone'),
Tracker = require('tracker/tracker.js'),
Request = require('request/request.bg.js'),
Mediator = require('mediator/mediator.js'),

profilesColl = new (Backbone.Collection.extend({
    model: Backbone.Model.extend({
        parse: function (profile) {
            if (profile.gid) {
                profile.id = -profile.gid;
            } else {
                profile.id = profile.uid;
            }
            return profile;
        }
    })
}))(),
ItemsColl = Backbone.Collection.extend({
    model: Backbone.Model.extend({
        parse: function (item) {
            item.id = [
                item.source_id,
                item.post_id,
                item.type
            ].join(':');
            return item;
        }
    })
}),
groupItemsColl = new ItemsColl(),
friendItemsColl = new ItemsColl(),
fetchNewsfeedDebounced,
readyPromise = Vow.promise(),
autoUpdateParams;

/**
 * Generates unique id for every item,
 * or merges new item into existing one with the same id;
 * For example new wall_photos will be merged with existing for the user
 */
function processRawItem(item) {
    var propertyName, collisionItem,
    typeToPropertyMap = {
        'wall_photo': 'photos',
        'photo': 'photos',
        'photo_tag': 'photo_tags',
        'note': 'notes',
        'friend': 'friends'
    },
    // used to eliminate duplicate items during merge
    collection = new (Backbone.Collection.extend({
        model: Backbone.Model.extend({
            parse: function (item) {
                item.id = item.pid || item.nid || item.pid;
                return item;
            }
        })
    }))();

    item.id = [item.source_id, item.post_id, item.type].join(':');

    if (item.source_id > 0) {
        collisionItem = friendItemsColl.get(item.id);
        friendItemsColl.remove(collisionItem);
    } else {
        collisionItem = groupItemsColl.get(item.id);
        groupItemsColl.remove(collisionItem);
    }

    if (collisionItem) {
        collisionItem = collisionItem.toJSON();

        if (collisionItem.type !== 'post') {
            // type "photo" item has "photos" property; note - notes etc
            propertyName = typeToPropertyMap[collisionItem.type];

            try {
                collection.add(item[propertyName].slice(1), {parse: true});
                collection.add(collisionItem[propertyName].slice(1), {parse: true});

                item[propertyName] = [collection.size()].concat(collection.toJSON());
            } catch (event) {
                Tracker.trackEvent(
                    'debug;v' + chrome.app.getDetails().version,
                    JSON.stringify([collisionItem, item, event.stack])
                );
            }
        }
    }

    if (item.source_id > 0) {
        friendItemsColl.add(item, {at: 0});
    } else {
        groupItemsColl.add(item, {at: 0});
    }
}
/**
 * API returns 'wall_photo' item for every post item with photo.
 *
 * @param {Array} items
 * return {Array} filtered array of items
 */
function discardOddWallPhotos(items) {
    return items.filter(function (item) {
        var wallPhotos, attachedPhotos;

        if (item.type === 'wall_photo') {
            wallPhotos = item.photos.slice(1);
            // collect all attachments from source_id's posts
            attachedPhotos = _.where(items, {
                type: 'post',
                source_id: item.source_id
            }).reduce(function (attachedPhotos, post) {
                if (post.attachments) {
                    attachedPhotos = attachedPhotos.concat(
                        _.where(post.attachments, {
                            type: 'photo'
                        }).map(function (attachment) {
                            return attachment.photo;
                        })
                    );
                }
                return attachedPhotos;
            }, []);
            //exclude attachedPhotos from wallPhotos
            wallPhotos = wallPhotos.filter(function (wallPhoto) {
                return !(_.findWhere(attachedPhotos, {
                    pid: wallPhoto.pid
                }));
            });
            item.photos = [wallPhotos.length].concat(wallPhotos);
            return  wallPhotos.length;
        }
        return true;
    });
}
/**
 * Deletes items, when there are more then MAX_ITEMS_COUNT.
 * Also removes unnecessary profiles after that
 */
function freeSpace() {
    var required_uids;

    if (friendItemsColl.size() > MAX_ITEMS_COUNT || groupItemsColl.size() > MAX_ITEMS_COUNT) {
        // slice items
        friendItemsColl.reset(friendItemsColl.slice(0, MAX_ITEMS_COUNT));
        groupItemsColl.reset(groupItemsColl.slice(0, MAX_ITEMS_COUNT));

        // gather required profiles' ids from new friends
        required_uids = _(friendItemsColl.where({
            type: 'friend'
        }).map(function (model) {
            // first element contains quantity
            return (model.get('friends') || []).slice(1);
        })).chain().flatten().pluck('uid').value();

        // gather required profiles from source_ids
        required_uids = _(required_uids.concat(
            groupItemsColl.pluck('source_id'),
            friendItemsColl.pluck('source_id')
        )).uniq();

        profilesColl.reset(profilesColl.filter(function (model) {
            return required_uids.indexOf(model.get('id')) !== -1;
        }));
    }
}
function fetchNewsfeed() {
    Request.api({code: [
        'return {newsfeed: API.newsfeed.get(',
        JSON.stringify(autoUpdateParams),
        '), time: API.utils.getServerTime()};'
    ].join('')}).done(function (response) {
        var newsfeed = response.newsfeed;

        autoUpdateParams.start_time = response.time;

        profilesColl
            .add(newsfeed.profiles, {parse: true})
            .add(newsfeed.groups, {parse: true});

        discardOddWallPhotos(newsfeed.items).forEach(processRawItem);

        // try to remove old items, if new were inserted
        if (newsfeed.items.length) {
            freeSpace();
        }
        fetchNewsfeedDebounced();
        readyPromise.fulfill();
    });
}
fetchNewsfeedDebounced = _.debounce(fetchNewsfeed, UPDATE_PERIOD);
/**
* Initialize all variables
*/
function initialize() {
    if (!readyPromise || readyPromise.isFulfilled()) {
        if (readyPromise) {
            readyPromise.reject();
        }
        readyPromise = Vow.promise();
    }
    readyPromise.then(function () {
        Mediator.pub('newsfeed:friends', {
            profiles: profilesColl.toJSON(),
            items: friendItemsColl.toJSON()
        });
        Mediator.pub('newsfeed:groups', {
            profiles: profilesColl.toJSON(),
            items: groupItemsColl.toJSON()
        });
    }).done();

    autoUpdateParams = {
        count: MAX_ITEMS_COUNT
    };
    profilesColl.reset();
    groupItemsColl.reset();
    friendItemsColl.reset();
    fetchNewsfeed();
}

// entry point
Mediator.sub('auth:success', function () {
    initialize();
});

// Subscribe to events from popup
Mediator.sub('newsfeed:friends:get', function () {
    readyPromise.then(function () {
        Mediator.pub('newsfeed:friends', {
            profiles: profilesColl.toJSON(),
            items: friendItemsColl.toJSON()
        });
    }).done();
});

Mediator.sub('newsfeed:groups:get', function () {
    readyPromise.then(function () {
        Mediator.pub('newsfeed:groups', {
            profiles: profilesColl.toJSON(),
            items: groupItemsColl.toJSON()
        });
    }).done();
});

readyPromise.then(function () {
    Mediator.sub('likes:changed', function (params) {
        var model, whereClause = {
            type: params.type,
            source_id: params.owner_id,
            post_id: params.item_id
        };
        if (params.owner_id > 0) {
            model = friendItemsColl.findWhere(whereClause);
        } else {
            model = groupItemsColl.findWhere(whereClause);
        }
        if (model) {
            model.set('likes', params.likes);
        }
    });
}).done();

readyPromise.then(function () {
    groupItemsColl.on('change add', _.debounce(function () {
        Mediator.pub('newsfeed:groups', {
            profiles: profilesColl.toJSON(),
            items: groupItemsColl.toJSON()
        });
    }), 0);
    friendItemsColl.on('change add', _.debounce(function () {
        Mediator.pub('newsfeed:friends', {
            profiles: profilesColl.toJSON(),
            items: friendItemsColl.toJSON()
        });
    }), 0);
}).done();

},{"backbone":32,"mediator/mediator.js":18,"request/request.bg.js":25,"tracker/tracker.js":29,"underscore":35,"vow":36}],20:[function(require,module,exports){
var
_ = require('underscore')._,
Backbone = require('backbone'),
Browser = require('browser/browser.bg.js'),
Mediator = require('mediator/mediator.js'),
Settings = require('notifications/settings.js'),
PersistentModel = require('persistent-model/persistent-model.js'),

audioInProgress = false, Notifications,

NotificationsSettings = PersistentModel.extend({
    initialize: function () {
        var sound, self = this;

        PersistentModel.prototype.initialize.apply(this, arguments);

        Mediator.sub('notifications:settings:get', function () {
            Mediator.pub('notifications:settings', self.toJSON());
        });
        Mediator.sub('notifications:settings:put', function (settings) {
            self.set(settings);
        });

        // TODO remove in v5.0.7
        // support legacy signal values (i.g. standart.mp3)
        sound = self.get('sound');
        ['standart', 'original'].some(function (type) {
            if (sound.signal.indexOf(type) > 0) {
                sound.signal = type;
                return true;
            }
        });
    }
}),
notificationsSettings = new NotificationsSettings({
    enabled: true,
    sound: {
        enabled: true,
        volume: 0.5,
        signal: Settings.standart
    },
    popups: {
        enabled: true,
        showText: true
    }
}, {name: 'notificationsSettings'}),

notificationQueue = new (Backbone.Collection.extend({
    initialize: function () {
        this
            .on('add remove reset', function () {
                Notifications.setBadge(notificationQueue.filter(function (model) {
                    return !model.get('noBadge');
                }).length);
            })
            .on('add', function (model) {
                if (!model.get('noSound')) {
                    Notifications.playSound();
                }
                if (!model.get('noPopup')) {
                    Notifications.createPopup(model.toJSON());
                }
            });

        Mediator.sub('auth:success', function () {
            notificationQueue.reset();
        });
        // Remove seen updates
        Mediator.sub('router:change', function (params) {
            if (params.tab && notificationQueue.size()) {
                notificationQueue.remove(notificationQueue.where({
                    type: params.tab
                }));
            }
        });
        // remove notifications about read messages
        Mediator.sub('chat:message:read', function (message) {
            if (!message.out) {
                notificationQueue.remove(notificationQueue.findWhere({
                    type: Notifications.CHAT
                }));
            }
        });
        Mediator.sub('notifications:queue:get', function () {
            Mediator.pub('notifications:queue', notificationQueue.toJSON());
        });
        // Clear badge, when notifications turned off and vice versa
        notificationsSettings.on('change:enabled', function (event, enabled) {
            Notifications.setBadge(enabled ? notificationQueue.size():'', true);
        });

    }
}))();

function getBase64FromImage(url, onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = "arraybuffer";
    xhr.open("GET", url);

    xhr.onload = function () {
        var base64, binary, bytes, mediaType;

        bytes = new Uint8Array(xhr.response);
        //NOTE String.fromCharCode.apply(String, ...
        //may cause "Maximum call stack size exceeded"
        binary = [].map.call(bytes, function (byte) {
            return String.fromCharCode(byte);
        }).join('');
        mediaType = xhr.getResponseHeader('content-type');
        base64 = [
            'data:',
            mediaType ? mediaType + ';':'',
            'base64,',
            btoa(binary)
        ].join('');
        onSuccess(base64);
    };
    xhr.onerror = onError;
    xhr.send();
}

module.exports = Notifications = {
    CHAT: 'chat',
    BUDDIES: 'buddies',
    NEWS: 'news',
    /**
     * Create notifications. Usually you will need only this method
     *
     * @param {Object} data
     * @param {String} data.type
     * @param {String} data.title
     * @param {String} data.message
     * @param {String} data.image
     * @param {Boolean} [data.noBadge]
     * @param {Boolean} [data.noPopup]
     */
    notify: function (data) {
        notificationQueue.push(data);
    },
    createPopup: function (options) {
        var popups = notificationsSettings.get('popups');

        if (notificationsSettings.get('enabled') && popups.enabled) {
            getBase64FromImage(options.image, function (base64) {
                try {
                    chrome.notifications.create(_.uniqueId(), {
                        type: 'basic',
                        title: options.title,
                        message: (popups.showText && options.message) || '',
                        iconUrl: base64
                    }, function () {});
                } catch (e) {
                    console.log(e);
                }
            });
        }
    },
    playSound: function () {
        var sound = notificationsSettings.get('sound'),
            audio = new Audio();

        if (notificationsSettings.get('enabled') && sound.enabled && !audioInProgress) {
            audioInProgress = true;

            audio.volume = sound.volume;
            audio.src = Settings[sound.signal];
            audio.play();

            audio.addEventListener('ended', function () {
                audioInProgress = false;
            });
        }
    },
    setBadge: function (count, force) {
        if (notificationsSettings.get('enabled') || force) {
            Browser.setBadgeText(count || '');
        }
    }
};

},{"backbone":32,"browser/browser.bg.js":4,"mediator/mediator.js":18,"notifications/settings.js":21,"persistent-model/persistent-model.js":22,"underscore":35}],21:[function(require,module,exports){
module.exports = {
    standart: 'notifications/standart.ogg',
    original: 'notifications/original.ogg'
};

},{}],22:[function(require,module,exports){
var Backbone = require('backbone'),
    storage = require('storage/storage.js');

module.exports = Backbone.Model.extend({
    /**
    * Stores and restores model from localStorage.
    * Requires 'name' in options, for localStorage key name
    *
    * @param {Object} attributes
    * @param {Object} options
    * @param {String} options.name
    */
    initialize: function (attributes, options) {
        var item;

        this._name = options.name;
        item = storage.getItem(this._name);

        if (item) {
            this.set(JSON.parse(item), {
                silent: true
            });
        }

        this.on('change', this._save.bind(this));
    },
    _save: function () {
        storage.setItem(this._name, JSON.stringify(this.toJSON()));
    }
});


},{"backbone":32,"storage/storage.js":28}],23:[function(require,module,exports){
var
storage = require('storage/storage.js'),
constructor = function (name) {
    var item = storage.getItem(name);

    if (item) {
        this._set = JSON.parse(item);
    } else {
        this._set = [];
    }
    this._name = name;
};
constructor.prototype = {
    _save: function () {
        storage.setItem(
            this._name,
            JSON.stringify(this._set)
        );
    },
    toArray: function () {
        return this._set;
    },
    add: function (value) {
        if (!this.contains(value)) {
            this._set.push(value);
            this._save();
        }
    },
    contains: function (value) {
        return this._set.indexOf(value) !== -1;
    },
    remove: function (value) {
        var position = this._set.indexOf(value);
        if (position !== -1) {
            this._set.splice(position, 1);
            this._save();
        }
    },
    size: function () {
        return this._set.length;
    }
};

module.exports = constructor;

},{"storage/storage.js":28}],24:[function(require,module,exports){
var UPDATE_NON_FRIENDS_PERIOD = 10000,

    Users = require('users/users.bg.js'),
    _ = require('underscore')._,
    Mediator = require('mediator/mediator.js'),
    Backbone = require('backbone');

module.exports = Backbone.Collection.extend({
    initialize: function () {
        Mediator.sub('longpoll:updates', this._onFriendUpdates.bind(this));

        this._updateNonFriends = _.debounce(
            this._updateNonFriends.bind(this),
            UPDATE_NON_FRIENDS_PERIOD
        );
        this._updateNonFriends();
    },
    _updateNonFriends: function () {
        var
        self = this,
        uids = this.where({
            isFriend: undefined,
            // don't select groups profiles
            gid: undefined
        }).map(function (model) {
            return model.get('uid');
        });

        if (uids.length) {
            Users.getProfilesById(uids).then(function (profiles) {
                profiles.forEach(function (profile) {
                    var model = self.get(profile.uid);
                    if (model) {
                        model.set('online', profile.online);
                    }
                });
            }).always(this._updateNonFriends.bind(this));
        } else {
            this._updateNonFriends();
        }

    },
    /**
     * @see http://vk.com/developers.php?oid=-17680044&p=Connecting_to_the_LongPoll_Server
     *
     * @param [Array] updates
     */
    _onFriendUpdates: function (updates) {
        updates.forEach(function (update) {
            var type = update[0],
            userId = Math.abs(update[1]), model;

            // 8,-$user_id,0 -- друг $user_id стал онлайн
            // 9,-$user_id,$flags -- друг $user_id стал оффлайн
            // ($flags равен 0, если пользователь покинул сайт (например, нажал выход) и 1,
            // если оффлайн по таймауту (например, статус away))
            if (type === 9 || type === 8) {
                model = this.get(Number(userId));
                if (model) {
                    model.set('online', Number(type === 8));
                }
            }
        }, this);
    }
});

},{"backbone":32,"mediator/mediator.js":18,"underscore":35,"users/users.bg.js":31}],25:[function(require,module,exports){
var
API_QUERIES_PER_REQUEST = 15,
// HTTPS only
// @see http://vk.com/pages?oid=-1&p=%D0%92%D1%8B%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%BE%D0%B2_%D0%BA_API
API_DOMAIN = 'https://api.vk.com/',
API_REQUESTS_DEBOUNCE = 400,
API_VERSION = 4.99,
XHR_TIMEOUT = 30000,

Vow = require('vow'),
_ = require('underscore')._,
Auth = require('auth/auth.bg.js'),
Env = require('env/env.js'),
Mediator = require('mediator/mediator.js'),

apiQueriesQueue = [];

if (Env.firefox) {
    var sdkRequest = require("sdk/request").Request;
}

// Custom errors
function HttpError(message) {
    this.name = 'HttpError';
    this.message = message;
}
function AccessTokenError(message) {
    this.name = 'AccessTokenError';
    this.message = message;
}
[HttpError, AccessTokenError].forEach(function (constructor) {
    constructor.prototype = new Error();
    constructor.prototype.constructor = constructor;
});

/**
 * Convert an object into a query params string
 *
 * @param {Object} params
 *
 * @returns {String}
 */
function querystring(params) {
    var query = [],
        i, key;

    for (key in params) {
        if (params[key] === undefined || params[key] === null)  {
            continue;
        }
        if (Array.isArray(params[key])) {
            for (i = 0; i < params[key].length; ++i) {
                if (params[key][i] === undefined || params[key][i] === null) {
                    continue;
                }
                query.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(params[key][i]));
            }
        } else {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
        }
    }
    return query.join('&');
}

/**
 * XMLHttpRequest onload handler.
 * Checks for an expired accessToken (e.g. a request that completed after relogin)
 *
 * @param {Vow.promise} ajaxPromise Will be resolved or rejected
 * @param {String} usedAccessToken
 * @param {String} responseText
 * @param {String} dataType Is ignored currently
 */
function onLoad(ajaxPromise, usedAccessToken, responseText) {
    Auth.getAccessToken().then(function (accessToken) {
        if (accessToken === usedAccessToken) {
            try {
                ajaxPromise.fulfill(JSON.parse(responseText));
            } catch (e) {
                ajaxPromise.fulfill(responseText);
            }
        } else {
            ajaxPromise.reject(new AccessTokenError());
        }
    });
}

/**
 * Make HTTP Request
 *
 * @param {String} type Post or get
 * @param {String} url
 * @param {Object|String} data to send
 * @param {String} dataType If "json" than reponseText will be parsed and returned as object
 */
function xhr(type, url, data, dataType) {
    return Auth.getAccessToken().then(function (accessToken) {
        var ajaxPromise = Vow.promise(), xhr,
            encodedData = typeof data === 'string' ? data:querystring(data);

        if (Env.firefox) {
            // TODO implement timeout
            sdkRequest({
                url: url,
                content: data === 'string' ? encodeURIComponent(data):data,
                onComplete: function (response) {
                    if (response.statusText === 'OK') {
                        onLoad(ajaxPromise, accessToken, response.text, dataType);
                    } else {
                        ajaxPromise.reject(new HttpError(response.status));
                    }
                }
            })[type]();
        } else {
            xhr = new XMLHttpRequest();
            xhr.onload = function () {
                onLoad(ajaxPromise, accessToken, xhr.responseText);
            };
            xhr.timeout = XHR_TIMEOUT;
            xhr.onerror = xhr.ontimeout = function (e) {
                ajaxPromise.reject(new HttpError(e));
            };
            type = type.toUpperCase();
            if (type === 'POST') {
                xhr.open(type, url, true);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
                xhr.send(encodedData);
            } else {
                xhr.open(type, url + '?' + encodedData, true);
                xhr.send();
            }
        }

        return ajaxPromise;
    });
}

Mediator.sub('request', function (params) {
    Request[params.method].apply(Request, params['arguments']).then(function () {
        Mediator.pub('request:' + params.id, {
            method: 'fulfill',
            'arguments': [].slice.call(arguments)
        });
    }, function () {
        Mediator.pub('request:' + params.id, {
            method: 'reject',
            'arguments': [].slice.call(arguments)
        });
    });
});

var Request = module.exports = {
    get: function (url, data, dataType) {
        return xhr('get', url, data, dataType);
    },
    post: function (url, data, dataType) {
        return xhr('post', url, data, dataType);
    },
    api: function (params) {
        var promise = Vow.promise();
        apiQueriesQueue.push({
            params: params,
            promise: promise
        });
        Request.processApiQueries();
        return promise;
    },
    processApiQueries: _.debounce(function () {
        if (apiQueriesQueue.length) {
            var queriesToProcess = apiQueriesQueue.splice(0, API_QUERIES_PER_REQUEST),
                executeCodeTokens = [], executeCode,  i, method, params;

            for (i = 0; i < queriesToProcess.length; i++) {
                params = queriesToProcess[i].params;
                method = params.method || 'execute';

                if (params.method) {
                    method = params.method;
                    delete params.method;
                }

                if (method === 'execute') {
                    executeCodeTokens.push(params.code.replace(/^return\s*|;$/g, ''));
                } else {
                    // TODO not implemented
                    throw 'not implemented';
                }
            }
            executeCode = 'return [' + executeCodeTokens + '];';

            Auth.getAccessToken().then(function (accessToken) {
                Request.post([API_DOMAIN, 'method/', method].join(''), {
                    method: 'execute',
                    code: executeCode,
                    access_token: accessToken,
                    v: API_VERSION
                }).then(function (data) {
                    if (data.execute_errors) {
                        console.warn(data.execute_errors);
                    }
                    var response = data.response, i;
                    if (Array.isArray(response)) {
                        for (i = 0; i < response.length; i++) {
                            queriesToProcess[i].promise.fulfill(response[i]);
                        }
                        Request.processApiQueries();
                    } else {
                        console.warn(data);
                        // force relogin on API error
                        Auth.login(true);
                    }
                }, function (e) {
                    // force relogin on API error
                    Auth.login(true);
                    console.log(e);
                }).done();
            }).done();
        }
    }, API_REQUESTS_DEBOUNCE)
};

},{"auth/auth.bg.js":3,"env/env.js":8,"mediator/mediator.js":18,"sdk/request":33,"underscore":35,"vow":36}],26:[function(require,module,exports){
/**
 * Returns a correct implementation
 * for background or popup page
 */
if (require('env/env.js').popup) {
    module.exports = require('./request.pu.js');
} else {
    module.exports = require('./request.bg.js');
}

},{"./request.bg.js":25,"./request.pu.js":33,"env/env.js":8}],27:[function(require,module,exports){
require('notifications/notifications.bg.js');
var
Mediator = require('mediator/mediator.js'),
PersistentModel = require('persistent-model/persistent-model.js'),

model = new PersistentModel(
    {lastPath: '/chat'},
    {name: 'router'}
);

Mediator.sub('router:lastPath:get', function () {
    Mediator.pub('router:lastPath', model.get('lastPath'));
});
Mediator.sub('router:lastPath:put', function (lastPath) {
    model.set('lastPath', lastPath);
});

module.exports = {
    /**
    * Returns true if an active tab in a popup is a feedbacks tab
    *
    * @returns {Boolean}
    */
    isFeedbackTabActive: function () {
        return model.get('lastPath').indexOf('my') !== -1;
    },
    /**
    * Returns true if an active tab in a popup is a chat tab
    *
    * @returns {Boolean}
    */
    isChatTabActive: function () {
        return model.get('lastPath').indexOf('chat') !== -1;
    }
};

},{"mediator/mediator.js":18,"notifications/notifications.bg.js":20,"persistent-model/persistent-model.js":22}],28:[function(require,module,exports){
var Env = require('env/env.js');

if (Env.firefox) {
    var storage = require("sdk/simple-storage");

    module.exports = {
        getItem: function (key) {
            return storage[key];
        },
        setItem: function (key, value) {
            storage[key] = value;
        }
    };
} else {
    module.exports = localStorage;
}



},{"env/env.js":8,"sdk/simple-storage":33}],29:[function(require,module,exports){
/*jshint bitwise: false */
var
_ = require('underscore')._,
PersistentModel = require('persistent-model/persistent-model.js'),
I18n = require('i18n/i18n.js'),
Request = require('request/request.js'),
Config = require('config/config.js'),

url = 'http://www.google-analytics.com/collect',
persistentModel = new PersistentModel({}, {name: 'tracker'}),
requiredParams;

/**
* Creates unique identifier if VKfox instance
*
* @see http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
*/
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

if (!persistentModel.has('guid')) {
    persistentModel.set('guid', guid());
}

requiredParams = {
    v: 1,               // Version.
    tid: Config.TRACKER_ID,    // Tracking ID / Web property / Property ID.
    cid: persistentModel.get('guid'), // Anonymous Client ID.
    ul: I18n.getLang(), //user language
    // TODO
    // ap: chrome.app.getDetails().version //app version
};

module.exports = {
    trackPage: function () {
        Request.post(url, _.extend({}, requiredParams, {
            t: 'pageview',          // Pageview hit type.
            dh: location.hostname,  // Document hostname.
            dp: location.pathname  // Page
        }));
    },
    /**
    * Tracks a custom event
    * @param {String} category
    * @param {String} action
    * @param {String} [label]
    * @param {Number} [value]
    */
    trackEvent: function (category, action, label, value) {
        Request.post(url, _.extend({}, requiredParams, {
            t: 'event', // Event hit type
            ec: category, // Event Category. Required.
            ea: action, // Event Action. Required.
            el: label, // Event label.
            ev: value, // Event value.
            dh: location.hostname,  // Document hostname.
            dp: location.pathname  // Page
        }));
    }
};

},{"config/config.js":7,"i18n/i18n.js":12,"persistent-model/persistent-model.js":22,"request/request.js":26,"underscore":35}],30:[function(require,module,exports){
/**
 * Returns user's name
 *
 * @param {Object|Array} input
 *
 * @returns {String}
 */
exports.getName = function (input) {
    return [].concat(input).map(function (owner) {
        //group profile
        if (owner.name) {
            return owner.name;
            //user profile
        } else {
            return owner.first_name + ' ' + owner.last_name;
        }
    }).join(', ');
};

},{}],31:[function(require,module,exports){
var
DROP_PROFILES_INTERVAL = 500,
USERS_GET_DEBOUNCE = 400,

Vow = require('vow'),
Backbone = require('backbone'),
Mediator = require('mediator/mediator.js'),
Request = require('request/request.bg.js'),
_ = require('underscore')._,

inProgress, usersGetQueue, friendsProfilesDefer,
usersColl = new (Backbone.Collection.extend({
    model: Backbone.Model.extend({
        idAttribute: 'uid'
    })
}))(),
dropOldNonFriendsProfiles = _.debounce(function () {
    if (!inProgress) {
        usersColl.remove(usersColl.filter(function (model) {
            return !model.get('isFriend');
        }));
    }
    dropOldNonFriendsProfiles();
}, DROP_PROFILES_INTERVAL),
/**
 * Resolves items from provided queue
 *
 * @param [Array] queue
 */
publishUids = function (queue) {
    var data, queueItem;

    function getProfileById(uid) {
        return _.clone(usersColl.get(Number(uid)));
    }

    while (queue.length) {
        queueItem = queue.pop();
        data = queueItem.uids.map(function (uid) {
            return getProfileById(uid).toJSON();
        });

        queueItem.promise.fulfill(data);
    }
},
processGetUsersQueue = _.debounce(function () {
    var processedQueue = usersGetQueue,
    newUids = _.chain(processedQueue).pluck('uids').flatten()
    .unique().difference(usersColl.pluck('id')).value();

    // start new queue
    usersGetQueue = [];

    if (newUids.length) {
        inProgress = true;
        Request.api({
            // TODO limit for uids.length
            code: 'return API.users.get({uids: "' + newUids.join() + '", fields: "online,photo,sex,nickname,lists"})'
        }).then(function (response) {
            if (response && response.length) {
                usersColl.add(response);
                publishUids(processedQueue);
                inProgress = false;
            }
        });
    } else {
        publishUids(processedQueue);
    }
}, USERS_GET_DEBOUNCE);
/**
 * Initialize all variables
 */
function initialize() {
    inProgress = false;
    usersColl.reset();
    usersGetQueue = [];
    friendsProfilesDefer = null;
}
initialize();

Mediator.sub('auth:success', function () {
    initialize();
});

dropOldNonFriendsProfiles();

module.exports = _.extend({
    getFriendsProfiles: function () {
        if (!friendsProfilesDefer) {
            friendsProfilesDefer = Request.api({
                code: 'return API.friends.get({ fields : "photo,sex,nickname,lists", order: "hints" })'
            }).then(function (response) {
                if (response && response.length) {
                    response.forEach(function (friendData) {
                        friendData.isFriend = true;
                    });
                    usersColl.add(response);
                }
                return response;
            }.bind(this));
        }

        return friendsProfilesDefer;
    },
    /**
     * Returns profiles by ids
     * @param [Array<<Number>>] uids Array of user's uds
     *
     * @returns {Vow.promise} Returns promise that will be fulfilled with profiles
     */
    getProfilesById: function (uids) {
        return this.getFriendsProfiles().then(function () {
            var promise = Vow.promise();

            usersGetQueue.push({
                uids: uids,
                promise: promise
            });
            processGetUsersQueue();
            return promise;
        });
    }
}, require('users/name.js'));

},{"backbone":32,"mediator/mediator.js":18,"request/request.bg.js":25,"underscore":35,"users/name.js":30,"vow":36}],32:[function(require,module,exports){
//     Backbone.js 1.0.0

//     (c) 2010-2013 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(){

  // Initial Setup
  // -------------

  // Save a reference to the global object (`window` in the browser, `exports`
  // on the server).
  var root = this;

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create local references to array methods we'll want to use later.
  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both the browser and the server.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = root.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '1.0.0';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
  // the `$` variable.
  Backbone.$ = root.jQuery || root.Zepto || root.ender || root.$;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = {};
        return this;
      }

      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeners = this._listeners;
      if (!listeners) return this;
      var deleteListener = !name && !callback;
      if (typeof name === 'object') callback = this;
      if (obj) (listeners = {})[obj._listenerId] = obj;
      for (var id in listeners) {
        listeners[id].off(name, callback, this);
        if (deleteListener) delete this._listeners[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
    }
  };

  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
      var listeners = this._listeners || (this._listeners = {});
      var id = obj._listenerId || (obj._listenerId = _.uniqueId('l'));
      listeners[id] = obj;
      if (typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Backbone **Models** are the basic data object in the framework --
  // frequently representing a row in a table in a database on your server.
  // A discrete chunk of data and a bunch of useful, related methods for
  // performing computations and transformations on that data.

  // Create a new model with the specified attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var defaults;
    var attrs = attributes || {};
    options || (options = {});
    this.cid = _.uniqueId('c');
    this.attributes = {};
    _.extend(this, _.pick(options, modelOptions));
    if (options.parse) attrs = this.parse(attrs, options) || {};
    if (defaults = _.result(this, 'defaults')) {
      attrs = _.defaults({}, attrs, defaults);
    }
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // A list of options to be attached directly to the model, if provided.
  var modelOptions = ['url', 'urlRoot', 'collection'];

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The value returned during the last failed validation.
    validationError: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function(key, val, options) {
      var attr, attrs, unset, changes, silent, changing, prev, current;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      unset           = options.unset;
      silent          = options.silent;
      changes         = [];
      changing        = this._changing;
      this._changing  = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }
      current = this.attributes, prev = this._previousAttributes;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // For each `set` attribute, update or delete the current value.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          this.changed[attr] = val;
        } else {
          delete this.changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = true;
        for (var i = 0, l = changes.length; i < l; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // You might be wondering why there's a `while` loop here. Changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the model, firing `"change"`.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overridden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        if (!model.set(model.parse(resp, options), options)) return false;
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      var attrs, method, xhr, attributes = this.attributes;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      // If we're not waiting and attributes exist, save acts as `set(attr).save(null, opts)`.
      if (attrs && (!options || !options.wait) && !this.set(attrs, options)) return false;

      options = _.extend({validate: true}, options);

      // Do not persist invalid models.
      if (!this._validate(attrs, options)) return false;

      // Set temporary attributes if `{wait: true}`.
      if (attrs && options.wait) {
        this.attributes = _.extend({}, attributes, attrs);
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = model.parse(resp, options);
        if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
          return false;
        }
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method === 'patch') options.attrs = attrs;
      xhr = this.sync(method, this, options);

      // Restore attributes.
      if (attrs && options.wait) this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var destroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (options.wait || model.isNew()) destroy();
        if (success) success(model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      if (this.isNew()) {
        options.success();
        return false;
      }
      wrapError(this, options);

      var xhr = this.sync('delete', this, options);
      if (!options.wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return this.id == null;
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return this._validate({}, _.extend(options || {}, { validate: true }));
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options || {}, {validationError: error}));
      return false;
    }

  });

  // Underscore methods that we want to implement on the Model.
  var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];

  // Mix in each Underscore method as a proxy to `Model#attributes`.
  _.each(modelMethods, function(method) {
    Model.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.attributes);
      return _[method].apply(_, args);
    };
  });

  // Backbone.Collection
  // -------------------

  // If models tend to represent a single row of data, a Backbone Collection is
  // more analagous to a table full of data ... or a small slice or page of that
  // table, or a collection of rows that belong together for a particular reason
  // -- all of the messages in this particular folder, all of the documents
  // belonging to this particular author, and so on. Collections maintain
  // indexes of their models, both in order, and for lookup by `id`.

  // Create a new **Collection**, perhaps to contain a specific type of `model`.
  // If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.url) this.url = options.url;
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // Default options for `Collection#set`.
  var setOptions = {add: true, remove: true, merge: true};
  var addOptions = {add: true, merge: false, remove: false};

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set.
    add: function(models, options) {
      return this.set(models, _.defaults(options || {}, addOptions));
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      models = _.isArray(models) ? models.slice() : [models];
      options || (options = {});
      var i, l, index, model;
      for (i = 0, l = models.length; i < l; i++) {
        model = this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byId[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model);
      }
      return this;
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      options = _.defaults(options || {}, setOptions);
      if (options.parse) models = this.parse(models, options);
      if (!_.isArray(models)) models = models ? [models] : [];
      var i, l, model, attrs, existing, sort;
      var at = options.at;
      var sortable = this.comparator && (at == null) && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;
      var toAdd = [], toRemove = [], modelMap = {};

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      for (i = 0, l = models.length; i < l; i++) {
        if (!(model = this._prepareModel(models[i], options))) continue;

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        if (existing = this.get(model)) {
          if (options.remove) modelMap[existing.cid] = true;
          if (options.merge) {
            existing.set(model.attributes, options);
            if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
          }

        // This is a new model, push it to the `toAdd` list.
        } else if (options.add) {
          toAdd.push(model);

          // Listen to added models' events, and index models for lookup by
          // `id` and by `cid`.
          model.on('all', this._onModelEvent, this);
          this._byId[model.cid] = model;
          if (model.id != null) this._byId[model.id] = model;
        }
      }

      // Remove nonexistent models if appropriate.
      if (options.remove) {
        for (i = 0, l = this.length; i < l; ++i) {
          if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
        }
        if (toRemove.length) this.remove(toRemove, options);
      }

      // See if sorting is needed, update `length` and splice in new models.
      if (toAdd.length) {
        if (sortable) sort = true;
        this.length += toAdd.length;
        if (at != null) {
          splice.apply(this.models, [at, 0].concat(toAdd));
        } else {
          push.apply(this.models, toAdd);
        }
      }

      // Silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      if (options.silent) return this;

      // Trigger `add` events.
      for (i = 0, l = toAdd.length; i < l; i++) {
        (model = toAdd[i]).trigger('add', model, this, options);
      }

      // Trigger `sort` if the collection was sorted.
      if (sort) this.trigger('sort', this, options);
      return this;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function(models, options) {
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i]);
      }
      options.previousModels = this.models;
      this._reset();
      this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, _.extend({at: this.length}, options));
      return model;
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, _.extend({at: 0}, options));
      return model;
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Slice out a sub-array of models from the collection.
    slice: function(begin, end) {
      return this.models.slice(begin, end);
    },

    // Get a model from the set by id.
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byId[obj.id != null ? obj.id : obj.cid || obj];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      if (_.isEmpty(attrs)) return first ? void 0 : [];
      return this[first ? 'find' : 'filter'](function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      // Run sort based on type of `comparator`.
      if (_.isString(this.comparator) || this.comparator.length === 1) {
        this.models = this.sortBy(this.comparator, this);
      } else {
        this.models.sort(_.bind(this.comparator, this));
      }

      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Figure out the smallest index at which a model should be inserted so as
    // to maintain order.
    sortedIndex: function(model, value, context) {
      value || (value = this.comparator);
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _.sortedIndex(this.models, model, iterator, context);
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.invoke(this.models, 'get', attr);
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success(collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      if (!(model = this._prepareModel(model, options))) return false;
      if (!options.wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(resp) {
        if (options.wait) collection.add(model, options);
        if (success) success(model, resp, options);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models);
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId  = {};
    },

    // Prepare a hash of attributes (or other model) to be added to this
    // collection.
    _prepareModel: function(attrs, options) {
      if (attrs instanceof Model) {
        if (!attrs.collection) attrs.collection = this;
        return attrs;
      }
      options || (options = {});
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model._validate(attrs, options)) {
        this.trigger('invalid', this, attrs, options);
        return false;
      }
      return model;
    },

    // Internal method to sever a model's ties to a collection.
    _removeReference: function(model) {
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event === 'add' || event === 'remove') && collection !== this) return;
      if (event === 'destroy') this.remove(model, options);
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        if (model.id != null) this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
  var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
    'tail', 'drop', 'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf',
    'isEmpty', 'chain'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function(method) {
    Collection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });

  // Backbone.View
  // -------------

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    this._configure(options || {});
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be prefered to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this.$el.remove();
      this.stopListening();
      return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;

        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.on(eventName, method);
        } else {
          this.$el.on(eventName, selector, method);
        }
      }
      return this;
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(e.g. model, collection, id, className)* are
    // attached directly to the view.  See `viewOptions` for an exhaustive
    // list.
    _configure: function(options) {
      if (this.options) options = _.extend({}, _.result(this, 'options'), options);
      _.extend(this, _.pick(options, viewOptions));
      this.options = options;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
        this.setElement($el, false);
      } else {
        this.setElement(_.result(this, 'el'), false);
      }
    }

  });

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // If we're sending a `PATCH` request, and we're in an old Internet Explorer
    // that still has ActiveX enabled by default, override jQuery to use that
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
    if (params.type === 'PATCH' && window.ActiveXObject &&
          !(window.external && window.external.msActiveXFilteringEnabled)) {
      params.xhr = function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
      };
    }

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  // Override this if you'd like to use a different library.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        callback && callback.apply(router, args);
        router.trigger.apply(router, ['route:' + name].concat(args));
        router.trigger('route', name, args);
        Backbone.history.trigger('route', router, name, args);
      });
      return this;
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional){
                     return optional ? match : '([^\/]+)';
                   })
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param) {
        return param ? decodeURIComponent(param) : null;
      });
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = this.location.pathname;
          var root = this.root.replace(trailingSlash, '');
          if (!fragment.indexOf(root)) fragment = fragment.substr(root.length);
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({}, {root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      if (oldIE && this._wantsHashChange) {
        this.iframe = Backbone.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        Backbone.$(window).on('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        Backbone.$(window).on('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = this.location;
      var atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;

      // If we've started off with a route from a `pushState`-enabled browser,
      // but we're currently in a browser that doesn't support it...
      if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) {
        this.fragment = this.getFragment(null, true);
        this.location.replace(this.root + this.location.search + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;

      // Or if we've started out with a hash-based route, but we're currently
      // in a browser where it could be `pushState`-based instead...
      } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
        this.fragment = this.getHash().replace(routeStripper, '');
        this.history.replaceState({}, document.title, this.root + this.fragment + loc.search);
      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      Backbone.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);
      clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment && this.iframe) {
        current = this.getFragment(this.getHash(this.iframe));
      }
      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl() || this.loadUrl(this.getHash());
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: options};
      fragment = this.getFragment(fragment || '');
      if (this.fragment === fragment) return;
      this.fragment = fragment;
      var url = this.root + fragment;

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function (model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

}).call(this);

},{"underscore":35}],33:[function(require,module,exports){

},{}],34:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],35:[function(require,module,exports){
//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {
    // Support ADDON SDK environment
    if (typeof setTimeout === 'undefined') {
        var timer = require('timer'),
            setImmediate = timer.setImmediate;
            clearImmediate = timer.clearImmediate;
            setTimeout = timer.setTimeout;
            setInterval = timer.setInterval;
            clearTimeout = timer.clearTimeout;
            clearInterval = timer.clearInterval;
    }

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  //use the faster Date.now if available.
  var getTime = (Date.now || function() {
    return new Date().getTime();
  });

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.5.2';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? void 0 : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed > result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = value == null ? _.identity : lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, value, context) {
      var result = {};
      var iterator = value == null ? _.identity : lookupIterator(value);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n == null) || guard ? array[0] : slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) {
      return array[array.length - 1];
    } else {
      return slice.call(array, Math.max(array.length - n, 0));
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, "length").concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error("bindAll must be passed function names");
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : getTime();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now = getTime();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    return function() {
      context = this;
      args = arguments;
      timestamp = getTime();
      var later = function() {
        var last = getTime() - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) {
            result = func.apply(context, args);
            context = args = null;
          }
        }
      };
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}).call(this);

},{"timer":33}],36:[function(require,module,exports){
var process=require("__browserify_process");/**
 * Vow
 *
 * Copyright (c) 2012-2013 Filatov Dmitry (dfilatov@yandex-team.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 0.3.12
 */

(function(global) {

// Support ADDON SDK environment
if (typeof setTimeout === 'undefined') {
    var timer = require('timer'),
    setImmediate = timer.setImmediate;
    clearImmediate = timer.clearImmediate;
    setTimeout = timer.setTimeout;
    setInterval = timer.setInterval;
    clearTimeout = timer.clearTimeout;
    clearInterval = timer.clearInterval;
}

var Promise = function(val) {
    this._res = val;

    this._isFulfilled = !!arguments.length;
    this._isRejected = false;

    this._fulfilledCallbacks = [];
    this._rejectedCallbacks = [];
    this._progressCallbacks = [];
};

Promise.prototype = {
    valueOf : function() {
        return this._res;
    },

    isFulfilled : function() {
        return this._isFulfilled;
    },

    isRejected : function() {
        return this._isRejected;
    },

    isResolved : function() {
        return this._isFulfilled || this._isRejected;
    },

    fulfill : function(val) {
        if(this.isResolved()) {
            return;
        }

        this._isFulfilled = true;
        this._res = val;

        this._callCallbacks(this._fulfilledCallbacks, val);
        this._fulfilledCallbacks = this._rejectedCallbacks = this._progressCallbacks = undef;
    },

    reject : function(err) {
        if(this.isResolved()) {
            return;
        }

        this._isRejected = true;
        this._res = err;

        this._callCallbacks(this._rejectedCallbacks, err);
        this._fulfilledCallbacks = this._rejectedCallbacks = this._progressCallbacks = undef;
    },

    notify : function(val) {
        if(this.isResolved()) {
            return;
        }

        this._callCallbacks(this._progressCallbacks, val);
    },

    then : function(onFulfilled, onRejected, onProgress, ctx) {
        if(onRejected && !isFunction(onRejected)) {
            ctx = onRejected;
            onRejected = undef;
        }
        else if(onProgress && !isFunction(onProgress)) {
            ctx = onProgress;
            onProgress = undef;
        }

        var promise = new Promise(),
            cb;

        if(!this._isRejected) {
            cb = { promise : promise, fn : isFunction(onFulfilled)? onFulfilled : undef, ctx : ctx };
            this._isFulfilled?
                this._callCallbacks([cb], this._res) :
                this._fulfilledCallbacks.push(cb);
        }

        if(!this._isFulfilled) {
            cb = { promise : promise, fn : onRejected, ctx : ctx };
            this._isRejected?
                this._callCallbacks([cb], this._res) :
                this._rejectedCallbacks.push(cb);
        }

        this.isResolved() || this._progressCallbacks.push({ promise : promise, fn : onProgress, ctx : ctx });

        return promise;
    },

    fail : function(onRejected, ctx) {
        return this.then(undef, onRejected, ctx);
    },

    always : function(onResolved, ctx) {
        var _this = this,
            cb = function() {
                return onResolved.call(this, _this);
            };

        return this.then(cb, cb, ctx);
    },

    progress : function(onProgress, ctx) {
        return this.then(undef, undef, onProgress, ctx);
    },

    spread : function(onFulfilled, onRejected, ctx) {
        return this.then(
            function(val) {
                return onFulfilled.apply(this, val);
            },
            onRejected,
            ctx);
    },

    done : function(onFulfilled, onRejected, onProgress, ctx) {
        this
            .then(onFulfilled, onRejected, onProgress, ctx)
            .fail(throwException);
    },

    delay : function(delay) {
        var timer,
            promise = this.then(function(val) {
                var promise = new Promise();
                timer = setTimeout(
                    function() {
                        promise.fulfill(val);
                    },
                    delay);

                return promise;
            });

        promise.always(function() {
            clearTimeout(timer);
        });

        return promise;
    },

    timeout : function(timeout) {
        var promise = new Promise(),
            timer = setTimeout(
                function() {
                    promise.reject(Error('timed out'));
                },
                timeout);

        promise.sync(this);
        promise.always(function() {
            clearTimeout(timer);
        });

        return promise;
    },

    sync : function(promise) {
        promise.then(
            this.fulfill,
            this.reject,
            this.notify,
            this);
    },

    _callCallbacks : function(callbacks, arg) {
        var len = callbacks.length;
        if(!len) {
            return;
        }

        var isResolved = this.isResolved(),
            isFulfilled = this.isFulfilled();

        nextTick(function() {
            var i = 0, cb, promise, fn;
            while(i < len) {
                cb = callbacks[i++];
                promise = cb.promise;
                fn = cb.fn;

                if(fn) {
                    var ctx = cb.ctx,
                        res;
                    try {
                        res = ctx? fn.call(ctx, arg) : fn(arg);
                    }
                    catch(e) {
                        promise.reject(e);
                        continue;
                    }

                    isResolved?
                        Vow.isPromise(res)?
                            (function(promise) {
                                res.then(
                                    function(val) {
                                        promise.fulfill(val);
                                    },
                                    function(err) {
                                        promise.reject(err);
                                    },
                                    function(val) {
                                        promise.notify(val);
                                    });
                            })(promise) :
                            promise.fulfill(res) :
                        promise.notify(res);
                }
                else {
                    isResolved?
                        isFulfilled?
                            promise.fulfill(arg) :
                            promise.reject(arg) :
                        promise.notify(arg);
                }
            }
        });
    }
};

var Vow = {
    Promise : Promise,

    promise : function(val) {
        return arguments.length?
            Vow.isPromise(val)?
                val :
                new Promise(val) :
            new Promise();
    },

    when : function(obj, onFulfilled, onRejected, onProgress, ctx) {
        return Vow.promise(obj).then(onFulfilled, onRejected, onProgress, ctx);
    },

    fail : function(obj, onRejected, ctx) {
        return Vow.when(obj, undef, onRejected, ctx);
    },

    always : function(obj, onResolved, ctx) {
        return Vow.promise(obj).always(onResolved, ctx);
    },

    progress : function(obj, onProgress, ctx) {
        return Vow.promise(obj).progress(onProgress, ctx);
    },

    spread : function(obj, onFulfilled, onRejected, ctx) {
        return Vow.promise(obj).spread(onFulfilled, onRejected, ctx);
    },

    done : function(obj, onFulfilled, onRejected, onProgress, ctx) {
        Vow.promise(obj).done(onFulfilled, onRejected, onProgress, ctx);
    },

    isPromise : function(obj) {
        return obj && isFunction(obj.then);
    },

    valueOf : function(obj) {
        return Vow.isPromise(obj)? obj.valueOf() : obj;
    },

    isFulfilled : function(obj) {
        return Vow.isPromise(obj)? obj.isFulfilled() : true;
    },

    isRejected : function(obj) {
        return Vow.isPromise(obj)? obj.isRejected() : false;
    },

    isResolved : function(obj) {
        return Vow.isPromise(obj)? obj.isResolved() : true;
    },

    fulfill : function(val) {
        return Vow.when(val, undef, function(err) {
            return err;
        });
    },

    reject : function(err) {
        return Vow.when(err, function(val) {
            var promise = new Promise();
            promise.reject(val);
            return promise;
        });
    },

    resolve : function(val) {
        return Vow.isPromise(val)? val : Vow.when(val);
    },

    invoke : function(fn) {
        try {
            return Vow.promise(fn.apply(global, slice.call(arguments, 1)));
        }
        catch(e) {
            return Vow.reject(e);
        }
    },

    forEach : function(promises, onFulfilled, onRejected, keys) {
        var len = keys? keys.length : promises.length,
            i = 0;
        while(i < len) {
            Vow.when(promises[keys? keys[i] : i], onFulfilled, onRejected);
            ++i;
        }
    },

    all : function(promises) {
        var resPromise = new Promise(),
            isPromisesArray = isArray(promises),
            keys = isPromisesArray?
                getArrayKeys(promises) :
                getObjectKeys(promises),
            len = keys.length,
            res = isPromisesArray? [] : {};

        if(!len) {
            resPromise.fulfill(res);
            return resPromise;
        }

        var i = len,
            onFulfilled = function() {
                if(!--i) {
                    var j = 0;
                    while(j < len) {
                        res[keys[j]] = Vow.valueOf(promises[keys[j++]]);
                    }
                    resPromise.fulfill(res);
                }
            },
            onRejected = function(err) {
                resPromise.reject(err);
            };

        Vow.forEach(promises, onFulfilled, onRejected, keys);

        return resPromise;
    },

    allResolved : function(promises) {
        var resPromise = new Promise(),
            isPromisesArray = isArray(promises),
            keys = isPromisesArray?
                getArrayKeys(promises) :
                getObjectKeys(promises),
            i = keys.length,
            res = isPromisesArray? [] : {};

        if(!i) {
            resPromise.fulfill(res);
            return resPromise;
        }

        var onProgress = function() {
                --i || resPromise.fulfill(promises);
            };

        Vow.forEach(promises, onProgress, onProgress, keys);

        return resPromise;
    },

    allPatiently : function(promises) {
        return Vow.allResolved(promises).then(function() {
            var isPromisesArray = isArray(promises),
                keys = isPromisesArray?
                    getArrayKeys(promises) :
                    getObjectKeys(promises),
                rejectedPromises, fulfilledPromises,
                len = keys.length, i = 0, key, promise;

            if(!len) {
                return isPromisesArray? [] : {};
            }

            while(i < len) {
                key = keys[i++];
                promise = promises[key];
                if(Vow.isRejected(promise)) {
                    rejectedPromises || (rejectedPromises = isPromisesArray? [] : {});
                    isPromisesArray?
                        rejectedPromises.push(promise.valueOf()) :
                        rejectedPromises[key] = promise.valueOf();
                }
                else if(!rejectedPromises) {
                    (fulfilledPromises || (fulfilledPromises = isPromisesArray? [] : {}))[key] = Vow.valueOf(promise);
                }
            }

            if(rejectedPromises) {
                throw rejectedPromises;
            }

            return fulfilledPromises;
        });
    },

    any : function(promises) {
        var resPromise = new Promise(),
            len = promises.length;

        if(!len) {
            resPromise.reject(Error());
            return resPromise;
        }

        var i = 0, err,
            onFulfilled = function(val) {
                resPromise.fulfill(val);
            },
            onRejected = function(e) {
                i || (err = e);
                ++i === len && resPromise.reject(err);
            };

        Vow.forEach(promises, onFulfilled, onRejected);

        return resPromise;
    },

    delay : function(val, timeout) {
        return Vow.promise(val).delay(timeout);
    },

    timeout : function(val, timeout) {
        return Vow.promise(val).timeout(timeout);
    }
};

var undef,
    nextTick = (function() {
        var fns = [],
            enqueueFn = function(fn) {
                return fns.push(fn) === 1;
            },
            callFns = function() {
                var fnsToCall = fns, i = 0, len = fns.length;
                fns = [];
                while(i < len) {
                    fnsToCall[i++]();
                }
            };

        if(typeof setImmediate === 'function') { // ie10, nodejs >= 0.10
            return function(fn) {
                enqueueFn(fn) && setImmediate(callFns);
            };
        }

        if(typeof process === 'object' && process.nextTick) { // nodejs < 0.10
            return function(fn) {
                enqueueFn(fn) && process.nextTick(callFns);
            };
        }

        if(global.postMessage) { // modern browsers
            var isPostMessageAsync = true;
            if(global.attachEvent) {
                var checkAsync = function() {
                        isPostMessageAsync = false;
                    };
                global.attachEvent('onmessage', checkAsync);
                global.postMessage('__checkAsync', '*');
                global.detachEvent('onmessage', checkAsync);
            }

            if(isPostMessageAsync) {
                var msg = '__promise' + +new Date,
                    onMessage = function(e) {
                        if(e.data === msg) {
                            e.stopPropagation && e.stopPropagation();
                            callFns();
                        }
                    };

                global.addEventListener?
                    global.addEventListener('message', onMessage, true) :
                    global.attachEvent('onmessage', onMessage);

                return function(fn) {
                    enqueueFn(fn) && global.postMessage(msg, '*');
                };
            }
        }

        var doc = global.document;
        if('onreadystatechange' in doc.createElement('script')) { // ie6-ie8
            var createScript = function() {
                    var script = doc.createElement('script');
                    script.onreadystatechange = function() {
                        script.parentNode.removeChild(script);
                        script = script.onreadystatechange = null;
                        callFns();
                };
                (doc.documentElement || doc.body).appendChild(script);
            };

            return function(fn) {
                enqueueFn(fn) && createScript();
            };
        }

        return function(fn) { // old browsers
            enqueueFn(fn) && setTimeout(callFns, 0);
        };
    })(),
    throwException = function(e) {
        nextTick(function() {
            throw e;
        });
    },
    isFunction = function(obj) {
        return typeof obj === 'function';
    },
    slice = Array.prototype.slice,
    toStr = Object.prototype.toString,
    isArray = Array.isArray || function(obj) {
        return toStr.call(obj) === '[object Array]';
    },
    getArrayKeys = function(arr) {
        var res = [],
            i = 0, len = arr.length;
        while(i < len) {
            res.push(i++);
        }
        return res;
    },
    getObjectKeys = Object.keys || function(obj) {
        var res = [];
        for(var i in obj) {
            obj.hasOwnProperty(i) && res.push(i);
        }
        return res;
    };

var defineAsGlobal = true;
if(typeof exports === 'object') {
    module.exports = Vow;
    defineAsGlobal = false;
}

if(typeof modules === 'object') {
    modules.define('vow', function(provide) {
        provide(Vow);
    });
    defineAsGlobal = false;
}

if(typeof define === 'function') {
    define(function(require, exports, module) {
        module.exports = Vow;
    });
    defineAsGlobal = false;
}

defineAsGlobal && (global.Vow = Vow);

})(this);

},{"__browserify_process":34,"timer":33}]},{},[1])
;