var Dispatcher = require('./dispatcher.js'),
    Mediator = Object.create(Dispatcher),
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

    Mediator.pub = function () {
        var args = arguments;

        Dispatcher.pub.apply(Mediator, arguments);

        activePorts.forEach(function (port) {
            port.postMessage([].slice.call(args));
        });
    };
}

module.exports = Mediator;
