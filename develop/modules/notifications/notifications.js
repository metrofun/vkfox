var
NOTIFICATIONS_SOUNDS = {
    standart: 'modules/notifications/standart.ogg',
    original: 'modules/notifications/original.ogg'
},

_ = require('underscore')._,
Backbone = require('backbone'),
Browser = require('modules/browser/browser.js'),
Mediator = require('modules/mediator/mediator.js'),
PersistentModel = require('modules/persistent-model/persistent-model.js'),

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
        signal: NOTIFICATIONS_SOUNDS.standart
    },
    popups: {
        enabled: true,
        showText: true
    }
}, {name: 'notificationsSettings'}),

notificationQueue = new Backbone.Collection.extend({
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
});

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
    createPopup: function (options) {
        var popups = NotificationsSettings.get('popups');

        if (NotificationsSettings.get('enabled') && popups.enabled) {
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
        var sound = NotificationsSettings.get('sound'),
            audio = new Audio();

        if (NotificationsSettings.get('enabled') && sound.enabled && !audioInProgress) {
            audioInProgress = true;

            audio.volume = sound.volume;
            audio.src = NOTIFICATIONS_SOUNDS[sound.signal];
            audio.play();

            audio.addEventListener('ended', function () {
                audioInProgress = false;
            });
        }
    },
    setBadge: function (count, force) {
        if (NotificationsSettings.get('enabled') || force) {
            Browser.setBadgeText(count || '');
        }
    }
};
