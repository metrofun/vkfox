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
        Dispatcher.pub.apply(Mediator, messageData);
    });

    // Code to make popup openable in a tab
    if (Env.development) {
        var data = require('sdk/self').data,
            oldPub = Mediator.pub,
            pageMod = require("sdk/page-mod"), activeWorkers = [];

        pageMod.PageMod({
            include: /.*vkfox\/data\/pages\/popup\.html/,
            // include: "resource://jid1-ci3mbxpmmpdxuq-at-jetpack/vkfox/data/pages/popup.html",
            contentScriptFile: data.url("modules/mediator/contentScript.js"),
            // contentScriptFile: data.url("pages/popup.js"),
            onAttach: function (worker) {
                // TODO
                activeWorkers = [worker];
                // activeWorkers.push(worker);
                worker.port.on('detach', function () {
                    var index = activeWorkers.indexOf(worker);
                    if (index !== -1) {
                        activeWorkers.splice(index, 1);
                    }
                });
                worker.port.on('message', function (messageData) {
                    Dispatcher.pub.apply(Mediator, [].slice.call(messageData));
                });
            }
        });

        Object.defineProperty(Mediator, 'pub', { value: function () {
            var args = [].slice.call(arguments);
            oldPub.apply(Mediator, args);

            activeWorkers.forEach(function (worker) {
                worker.port.emit('message', args);
            });
        }, writable: true, enumerable: true});
    }
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
        var args = arguments;
        Dispatcher.pub.apply(Mediator, args);

        activePorts.forEach(function (port) {
            port.postMessage([].slice.call(args));
        });
    };
}

module.exports = Mediator;
