console.log(location.href);
require('angularKeypress');
require('angular').module('app', ['ui.keypress']);
require('filters/filters.pu.js');
require('anchor/anchor.pu.js');
require('tooltip/tooltip.pu.js');
require('router/router.pu.js');
//debug
window.onerror = function () {
    require('mediator/mediator.js').pub(arguments);
};
// console.log = function () {
    // extension.sendMessage(arguments);
// };
