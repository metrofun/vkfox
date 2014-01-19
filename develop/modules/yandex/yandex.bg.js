var Env = require('env/env.js'),
    Mediator = require('mediator/mediator.js'),
    Browser = require('browser/browser.bg.js'),
    data = require('sdk/self').data;

Mediator.sub('yandex:dialog:close', function () {
    Browser.closeTabs(data.url('pages/install.html'));
});

if (Env.firefox) {
    require('./yandex.moz.bg.js');
} else if (Env.chrome) {
    require('./yandex.webkit.bg.js');
}
