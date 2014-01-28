/**
 * Returns a correct implementation
 * for background or popup page
 */
if (require('env/env.js').popup) {
    module.exports = require('./mediator.pu.js');
} else {
    module.exports = require('./mediator.bg.js');
}
