angular.module('request', ['mediator'])
    .factory('Request', function (Mediator) {
        return {
            api: function () {
                var ajaxDeferred = new jQuery.Deferred(),
                id = _.uniqueId();

                Mediator.pub('request', {
                    method: 'api',
                    id: id,
                    'arguments': [].slice.apply(arguments)
                });
                Mediator.once('request:' + id, function (data) {
                    ajaxDeferred[data.method].apply(ajaxDeferred, data['arguments']);
                    console.log(data['arguments']);
                });

                return ajaxDeferred;

            }
        };
    });
