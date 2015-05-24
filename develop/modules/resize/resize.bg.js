var Env = require('env/env.js'),
    browser = require('browser/browser.bg.js');

module.exports = require('proxy-methods/proxy-methods.js').connect('resize/resize.bg.js', {
    setPanelSize: function(width, height) {
        if (Env.firefox) {
            browser.getFirefoxPanel().resize(width, height);
        }
    }
});
