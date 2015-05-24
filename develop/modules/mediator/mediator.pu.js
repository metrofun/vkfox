var Dispatcher = require('./dispatcher.js'),
    Mediator = Object.create(Dispatcher),
    Env = require('env/env.js');

if (Env.firefox) {
    // is opened from panel
    if (typeof addon !== 'undefined') {
        addon.port.on('message', function (messageData) {
            Dispatcher.pub.apply(Mediator, [].slice.call(messageData));
        });

        Mediator.pub = function () {
            Dispatcher.pub.apply(Dispatcher, arguments);

            addon.port.emit('message', [].slice.call(arguments));
        };
    } else {
        Mediator.pub = function () {
            var data = JSON.stringify([].slice.call(arguments));
            Dispatcher.pub.apply(Dispatcher, arguments);

            window.postMessage({from: 'page', data: data}, '*');
        };

        window.addEventListener('message', function (e) {
            if (e.data.from === 'content-script') {
                Dispatcher.pub.apply(Mediator, JSON.parse(e.data.data));
            }
        });
    }
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
