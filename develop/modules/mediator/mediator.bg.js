var Dispatcher = require('dispatcher/dispatcher.js'),
    Env = require('env/env.js');

if (Env.firefox) {
    throw "not implemented";
    // Mediator.sub('all', function () {
        // browserAction.sendMessage([].slice.call(arguments));
    // });
    // browserAction.onMessage = function () {
        // Mediator.pub.apply(Mediator, arguments);
    // };
} else {
    var activePorts = [];

    chrome.runtime.onConnect.addListener(function (port) {
        activePorts.push(port);
        port.onMessage.addListener(function (messageData) {
            Dispatcher.pub.apply(Dispatcher, messageData);
        });
        port.onDisconnect.addListener(function () {
            activePorts = activePorts.filter(function (active) {
                return active !== port;
            });
        });
    });

    Dispatcher.sub('all', function () {
        var args = arguments;

        Dispatcher.pub.apply(Dispatcher, args);
        activePorts.forEach(function (port) {
            port.postMessage([].slice.call(args));
        });
    });
}

return Dispatcher;
