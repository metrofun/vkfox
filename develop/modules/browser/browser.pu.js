var Env = require('env/env.js'),
    Mediator = require('mediator/mediator.js');

exports.createTab = function () {
    if (Env.firefox) {
        this.createTab = function (url) {
            Mediator.pub('browser:createTab', url);
        };
    } else {
        this.createTab = function (url) {
            chrome.tabs.create({url: url});
        };
    }
    this.createTab.apply(this, arguments);
};

