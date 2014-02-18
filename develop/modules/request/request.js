/**
 * Returns a correct implementation
 * for background or popup page
 */
if (require('env/env.js').background) {
    module.exports = require('./request.bg.js');
} else {
    var ProxyMethods = require('proxy-methods/proxy-methods.js');

    module.exports = ProxyMethods.forward('request/request.bg.js', ['api', 'post', 'get']);
}
