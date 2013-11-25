/**
 * Returns a correct implementation
 * for background or popup page
 */
return require(require('env/env.js') ? './request.pu.js':'./request.bg.js');
