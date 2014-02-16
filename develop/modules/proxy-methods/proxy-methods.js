/**
 * This module is used to proxy methods call from one module to another.
 * Is used to proxy calls from popup to background.
 * ProxyMethods can proxy only methods that return promises or no value,
 * because use the asynchronous Mediator underneath.
 */
var Vow = require('shim/vow.js'),
    _ = require('shim/underscore.js')._,
    Mediator = require('mediator/mediator.js');

module.exports = {
    /**
     * Backup forwarded calls. Second arguments is required due to browserify issue
     * that you can't require some module, if it was not explicitely required in a file
     *
     * @param {String} namespace Name of module that accepts forwarded calls
     * @param {Object} Module Module implementation that backups forwarded calls.
     *
     * @returns {Object} returns second argument, used for chaining
     */
    connect: function (namespace, Module) {
        Mediator.sub('proxy-methods:' + namespace, function (params) {
            var result = Module[params.method].apply(Module, params['arguments']);

            if (Vow.isPromise(result)) {
                result.always(function (promise) {
                    Mediator.pub('proxy-methods:' + params.id, {
                        method: promise.isFulfilled() ? 'fulfill':'reject',
                        'arguments': [promise.valueOf()]
                    });
                }).done();
            }
        });

        return Module;
    },
    /**
     * Forward calls of passed methods to nother side.
     * Another side must call 'connect' method to make it work.
     * Can forward only methods that return promise or undefined.
     *
     * @param {String} namespace Name of module, whose methods will be proxied
     * @param {Array} methodNames Contains names of methods, that will be proxied
     *
     * @returns {Object}
     */
    forward: function (namespace, methodNames) {
        return methodNames.reduce(function (exports, methodName) {
            exports[methodName] = function () {
                var ajaxPromise = new Vow.promise(),
                    id = _.uniqueId();

                Mediator.pub('proxy-methods:' + namespace, {
                    method: methodName,
                    id: id,
                    'arguments': [].slice.apply(arguments)
                });
                Mediator.once('proxy-methods:' + id, function (data) {
                    ajaxPromise[data.method].apply(ajaxPromise, data['arguments']);
                });

                return ajaxPromise;
            };
            return exports;
        }, {});
    }
};
