angular.module('notifications', ['mediator'])
    .config(function ($provide) {
        var QUEUE_TYPES = ['chat', 'news'],
            notificationQueue = new Backbone.Collection();

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

        chrome.browserAction.setBadgeBackgroundColor({
            color: [231, 76, 60, 255]
        });
        notificationQueue.on('add remove reset', function () {
            var count = notificationQueue.size();

            chrome.browserAction.setBadgeText({
                text: count ? String(count):''
            });
        });

        $provide.value('notificationQueue', notificationQueue);
        $provide.factory('Notifications', function () {
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
                    if (QUEUE_TYPES.indexOf(type) !== -1) {
                        notificationQueue.push({type: type});
                    }

                    // TODO on error
                    getBase64FromImage(options.image, function (base64) {
                        chrome.notifications.create(_.uniqueId(), {
                            type: 'basic',
                            title: options.title,
                            message: options.message || '',
                            iconUrl: base64
                        }, function () {});
                    });
                }
            };
        });
    })
    .run(function (Mediator, notificationQueue) {
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
        Mediator.sub('notifications:queue:get', function () {
            Mediator.pub('notifications:queue', notificationQueue.toJSON());
        });

    });
