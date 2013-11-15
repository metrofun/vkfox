angular.module('mediator')
    .factory('Mediator', function (MediatorDispatcher) {
        var Mediator = Object.create(MediatorDispatcher),
            activePort;

        activePort = chrome.runtime.connect();
        activePort.onMessage.addListener(function (messageData) {
            MediatorDispatcher.pub.apply(MediatorDispatcher, messageData);
        });

        Mediator.pub = function () {
            MediatorDispatcher.pub.apply(MediatorDispatcher, arguments);

            activePort.postMessage([].slice.call(arguments));
        };

        return Mediator;
    });
