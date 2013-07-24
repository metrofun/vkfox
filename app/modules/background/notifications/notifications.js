angular.module('notifications', ['mediator']).factory('Notifications', function (Mediator) {
    var notificationQueue = new Backbone.Collection();

    chrome.browserAction.setBadgeBackgroundColor({
        color: [231, 76, 60, 255]
    });
    Mediator.sub('auth:success', function () {
        notificationQueue.reset();
    });
    notificationQueue.on('add remove reset', function () {
        var count = notificationQueue.size();

        chrome.browserAction.setBadgeText({
            text: count ? String(count):''
        });
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
            notificationQueue.push({type: type});

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
