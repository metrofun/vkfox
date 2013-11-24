var Vow = require('vow'),
    _ = require('underscore')._,
    Mediator = require('mediator/mediator.js');

module.exports = {
    api: function () {
        var ajaxPromise = new Vow.promise(),
            id = _.uniqueId();

        Mediator.pub('request', {
            method: 'api',
            id: id,
            'arguments': [].slice.apply(arguments)
        });
        Mediator.once('request:' + id, function (data) {
            ajaxPromise[data.method].apply(ajaxPromise, data['arguments']);
        });

        return ajaxPromise;

    }
};
