var Dispatcher = require('./dispatcher.js'),
    Mediator = Object.create(Dispatcher),
    Env = require('env/env.js');

if (Env.firefox) {
    Dispatcher.sub('all', function () {
        extension.sendMessage([].slice.call(arguments));
    });
    extension.onMessage = function () {
        Dispatcher.pub.apply(Dispatcher, arguments);
    };
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
