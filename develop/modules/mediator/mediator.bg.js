var Dispatcher = require('./dispatcher.js'),
    Mediator = Object.create(Dispatcher),
    Browser = require('browser/browser.bg.js'),
    Env = require('env/env.js');

if (Env.firefox) {
    var browserAction = Browser.getBrowserAction();

    Object.defineProperty(Mediator, 'pub', { value: function () {
        Dispatcher.pub.apply(Mediator, arguments);
        browserAction.sendMessage([].slice.call(arguments));
    }, writable: true, enumerable: true});

    browserAction.onMessage.addListener(function (messageData) {
        console.log('recieve', messageData);
        Dispatcher.pub.apply(Mediator, messageData);
    });
} else {
    var activePorts = [];

    chrome.runtime.onConnect.addListener(function (port) {
        activePorts.push(port);
        port.onMessage.addListener(function (messageData) {
            Dispatcher.pub.apply(Mediator, messageData);
        });
        port.onDisconnect.addListener(function () {
            activePorts = activePorts.filter(function (active) {
                return active !== port;
            });
        });
    });

    Mediator.pub = function () {
        Dispatcher.pub.apply(Mediator, arguments);

        activePorts.forEach(function (port) {
            port.postMessage([].slice.call(arguments));
        });
    };
}

module.exports = Mediator;
