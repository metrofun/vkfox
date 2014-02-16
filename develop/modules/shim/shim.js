/*jshint newcap: false*/
/*
 * In FF default require doesn't provide some global functions,
 * like setImmidiate or setInterval,
 * which are used in3rd party libs.
 * This loader solves this issues.
 * Is used to laod unserscore and shim/vow.js libs
 */
var Env = require('env/env.js');
if (Env.background && Env.firefox) {
    var toolkitLoader = require('toolkit/loader'),
        Require = toolkitLoader.Require,
        Loader = toolkitLoader.Loader,
        timer = require('sdk/timers'),
        loader = Loader(toolkitLoader.override(require('@loader/options'), {
            globals: toolkitLoader.override(require('sdk/system/globals'), {
                setImmediate: timer.setImmediate.bind(timer),
                clearImmediate: timer.clearImmediate.bind(timer),
                setTimeout: timer.setTimeout.bind(timer),
                setInterval: timer.setInterval.bind(timer),
                clearTimeout: timer.clearTimeout.bind(timer),
                clearInterval: timer.clearInterval.bind(timer),
            })
        }));

    (function () {
        var require = Require(loader, module);

        exports.vow = require('vow');
        exports.underscore = require('underscore');
    })();
} else {
    exports.vow = require('vow');
    exports.underscore = require('underscore');
}
