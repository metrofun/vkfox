/**
 * Returns a correct implementation
 * for background or popup page
 */
if (require('env/env.js').background) {
    module.exports = require('tracker/tracker.bg.js');
} else {
    var ProxyMethods = require(('proxy-methods/proxy-methods.js'));

    module.exports = ProxyMethods.forward(
        'tracker/tracker.bg.js',
        ['trackPage', 'trackEvent', 'error', 'debug']
    );
}
