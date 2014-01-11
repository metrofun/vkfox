/**
 * Returns a correct implementation
 * for background or popup page
 */
if (require('env/env.js').background) {
    module.exports = require('browser/browser.bg.js');
} else {
    var ProxyMethods = require(('proxy-methods/proxy-methods.js'));

    module.exports = ProxyMethods.forward('browser/browser.bg.js', ['createTab', 'getVkfoxVersion']);
}
