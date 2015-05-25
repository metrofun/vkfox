var Env = require('env/env.js'),
    Mediator = require('mediator/mediator.js'),
    Browser = require('browser/browser.bg.js');

Mediator.sub('yandex:dialog:close', function () {
    Browser.closeTabs('pages/install.html');
});

if (Env.firefox) {
    require('./yandex.moz.bg.js');
}
