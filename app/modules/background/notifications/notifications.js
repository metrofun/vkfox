/*jshint bitwise:false */
angular.module('notifications', ['mediator', 'persistent-model'])
    .constant('STANDART_SIGNAL', 'audio/standart.mp3')
    .constant('ORIGINAL_SIGNAL', 'audio/original.mp3')
    .constant('NOTIFICATIONS_CHAT', 'chat')
    .constant('NOTIFICATIONS_NEWS', 'news')
    .factory('notificationSettings', function (Mediator, PersistentModel, STANDART_SIGNAL) {
        var notificationSettings = new PersistentModel(
            {
                enabled: true,
                sound: {
                    enabled: true,
                    volume: 0.5,
                    signal: STANDART_SIGNAL
                },
                popups: {
                    enabled: true,
                    showText: true
                }
            },
            {name: 'notificationSettings'}
        );

        Mediator.sub('notifications:settings:get', function () {
            Mediator.pub('notifications:settings', notificationSettings.toJSON());
        });
        Mediator.sub('notifications:settings:put', function (settings) {
            notificationSettings.set(settings);
        });

        return notificationSettings;
    })
    .factory('notificationQueue', function (
        notificationSettings,
        Mediator,
        NOTIFICATIONS_CHAT
    ) {
        var notificationQueue = new Backbone.Collection();

        chrome.browserAction.setBadgeBackgroundColor({
            color: [231, 76, 60, 255]
        });
        notificationSettings.on('change:enabled', function (event, enabled) {
            var count = notificationQueue.size();

            chrome.browserAction.setBadgeText({
                text: (enabled && count && String(count)) || ''
            });
        });
        notificationQueue.on('add remove reset', function () {
            if (notificationSettings.get('enabled')) {
                var count = notificationQueue.size();

                chrome.browserAction.setBadgeText({
                    text: count ? String(count):''
                });
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

        return notificationQueue;
    })
    .factory('Notifications', function (
        notificationQueue,
        notificationSettings,
        NOTIFICATIONS_CHAT,
        NOTIFICATIONS_NEWS
    ) {
        var QUEUE_TYPES = [NOTIFICATIONS_CHAT, NOTIFICATIONS_NEWS],
            audioInProgress = false,
            audio = new Audio();

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

        return {
            /**
            * Show new notifications
            *
            * @param {Object} options
            * @param {String} options.title
            * @param {String} [options.photo]
            * @param {String} [options.message='']
            */
            create: function (type, options) {
                var popups = notificationSettings.get('popups'),
                    sound = notificationSettings.get('sound');

                if (QUEUE_TYPES.indexOf(type) !== -1) {
                    notificationQueue.push({type: type});
                }

                if (notificationSettings.get('enabled')) {
                    if (popups.enabled) {
                        // TODO on error
                        getBase64FromImage(options.image, function (base64) {
                            chrome.notifications.create(_.uniqueId(), {
                                type: 'basic',
                                title: options.title,
                                message: (popups.showText && options.message) || '',
                                iconUrl: base64
                            }, function () {});
                        });
                    }
                    if (sound.enabled && !audioInProgress) {
                        audioInProgress = true;

                        audio.volume = sound.volume;
                        audio.src = sound.signal;
                        audio.play();

                        audio.addEventListener('ended', function () {
                            audioInProgress = false;
                        });
                    }
                }
            }
        };
    })
    .run(function (notificationQueue) {
        notificationQueue.reset();
    });
