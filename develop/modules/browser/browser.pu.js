var Env = require('env/env.js'),
    Mediator = require('mediator/mediator.js');

module.exports = {
    createTab: (function () {
        if (Env.firefox) {
            return function (url) {
                Mediator.pub('browser:createTab', url);
                console.log('createTab');
            };
        } else {
            return function (url) {
                chrome.tabs.create({url: url});
            };
        }
    })()
};

