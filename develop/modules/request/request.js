/**
 * Returns a correct implementation
 * for background or popup page
 */
if (require('env/env.js').popup) {
    module.exports = require('./request.pu.js');
} else {
    module.exports = require('./request.bg.js');
}
