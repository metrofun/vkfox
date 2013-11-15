angular.module('notifications', ['mediator', 'persistent-model', 'config', 'browser'])
    .constant('NOTIFICATIONS_CHAT', 'chat')
    .constant('NOTIFICATIONS_BUDDIES', 'buddies')
    .constant('NOTIFICATIONS_NEWS', 'news')
    .factory('NotificationsQueue', function (
        NotificationsSettings,
        Notifications,
        Mediator,
        NOTIFICATIONS_CHAT
    ) {
        var notificationQueue = new Backbone.Collection();

        notificationQueue.on('add remove reset', function () {
            Notifications.setBadge(notificationQueue.filter(function (model) {
                return !model.get('noBadge');
            }).length);
        });

        notificationQueue.on('add', function (model) {
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
                    type: NOTIFICATIONS_CHAT
                }));
            }
        });
        Mediator.sub('notifications:queue:get', function () {
            Mediator.pub('notifications:queue', notificationQueue.toJSON());
        });

        // Clear badge, when notifications turned off and vice versa
        NotificationsSettings.on('change:enabled', function (event, enabled) {
            Notifications.setBadge(enabled ? notificationQueue.size():'', true);
        });

        return notificationQueue;
    })
    .factory('NotificationsSettings', function (Mediator, PersistentModel, NOTIFICATIONS_SOUNDS) {
        var notificationsSettings = new PersistentModel(
            {
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
            },
            {name: 'notificationsSettings'}
        ), sound;

        Mediator.sub('notifications:settings:get', function () {
            Mediator.pub('notifications:settings', notificationsSettings.toJSON());
        });
        Mediator.sub('notifications:settings:put', function (settings) {
            notificationsSettings.set(settings);
        });

        // TODO remove in v5.0.7
        // support legacy signal values (i.g. standart.mp3)
        sound = notificationsSettings.get('sound');
        ['standart', 'original'].some(function (type) {
            if (sound.signal.indexOf(type) > 0) {
                sound.signal = type;
                return true;
            }
        });

        return notificationsSettings;
    })
    .factory('Notifications', function (NotificationsSettings, Browser, NOTIFICATIONS_SOUNDS) {
        var audioInProgress = false,
            audio = new Audio(),
            Notifications;

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

        Notifications = {
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
                var sound = NotificationsSettings.get('sound');

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

        return Notifications;
    });
