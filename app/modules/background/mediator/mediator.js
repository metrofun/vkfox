angular.module('mediator')
    .factory('Mediator', function (MediatorDispatcher) {
        var Mediator = Object.create(MediatorDispatcher),
            activePort;

        chrome.runtime.onMessage.addListener(function (messageData) {
            MediatorDispatcher.pub.apply(MediatorDispatcher, messageData);
        });

        chrome.runtime.onConnect.addListener(function (port) {
            activePort = port;
            port.onMessage.addListener(function (messageData) {
                MediatorDispatcher.pub.apply(MediatorDispatcher, messageData);
            });
            port.onDisconnect.addListener(function () {
                activePort = null;
            });
        });

        Mediator.pub = function () {
            MediatorDispatcher.pub.apply(MediatorDispatcher, arguments);
            if (activePort) {
                activePort.postMessage([].slice.call(arguments));
            }
        };

        return Mediator;
    });
