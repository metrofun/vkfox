var Dispatcher = require('dispatcher/dispatcher.js'),
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

    Dispatcher.sub('all', function () {
        activePort.postMessage([].slice.call(arguments));
    });
}

return Dispatcher;
