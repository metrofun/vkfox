angular.module('mediator')
    .factory('Mediator', function (MediatorDispatcher) {
        var Mediator = Object.create(MediatorDispatcher),
            activePorts = [];

        chrome.runtime.onConnect.addListener(function (port) {
            activePorts.push(port);
            port.onMessage.addListener(function (messageData) {
                MediatorDispatcher.pub.apply(MediatorDispatcher, messageData);
            });
            port.onDisconnect.addListener(function () {
                activePorts = activePorts.filter(function (active) {
                    return active !== port;
                });
            });
        });

        Mediator.pub = function () {
            var args = arguments;
            MediatorDispatcher.pub.apply(MediatorDispatcher, args);

            activePorts.forEach(function (port) {
                port.postMessage([].slice.call(args));
            });
        };

        return Mediator;
    });
