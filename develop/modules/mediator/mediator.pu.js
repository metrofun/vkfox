/* global self */
var Dispatcher = require('./dispatcher.js'),
    Mediator = Object.create(Dispatcher),
    Env = require('env/env.js');

if (Env.firefox) {
    Mediator.pub = function () {
        Dispatcher.pub.apply(Dispatcher, arguments);
        extension.sendMessage([].slice.call(arguments));
    };
    extension.onMessage.addListener(function (messageData) {
        Dispatcher.pub.apply(Mediator, messageData);
    });
} else {
    var activePort = chrome.runtime.connect();

    activePort.onMessage.addListener(function (messageData) {
        Dispatcher.pub.apply(Dispatcher, messageData);
    });

    Mediator.pub = function () {
        Dispatcher.pub.apply(Dispatcher, arguments);
        activePort.postMessage([].slice.call(arguments));
    };
}

module.exports = Mediator;
