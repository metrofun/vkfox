/**
 * Returns a correct implementation
 * for background or popup page
 */
return require(require('env/env.js') ? './mediator.pu.js':'./mediator.bg.js');
