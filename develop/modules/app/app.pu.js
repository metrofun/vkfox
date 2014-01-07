require('angular').module('app', ['ui.keypress']);
//include resize as soon as possible,
//because it sets width/height
require('resize/resize.pu.js');
require('angularKeypress');
require('filters/filters.pu.js');
require('anchor/anchor.pu.js');
require('tooltip/tooltip.pu.js');
require('router/router.pu.js');

window.onerror = function () {
    require('mediator/mediator.js').pub(arguments);
};
if (require('env/env.js').firefox) {
    // console.log = function () {
        // extension.sendMessage(arguments);
    // };
}
console.log(location.href);
