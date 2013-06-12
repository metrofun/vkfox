angular.module('request', ['mediator'])
    .factory('request', function (mediator) {
        return {
            api: function () {
                var ajaxDeferred = new jQuery.Deferred(),
                id = _.uniqueId();

                mediator.pub('request', {
                    method: 'api',
                    id: id,
                    arguments: [].slice.apply(arguments)
                });
                mediator.once('request:' + id, function (data) {
                    ajaxDeferred[data.method].apply(ajaxDeferred, data.arguments);
                    console.log(data.arguments);
                });

                return ajaxDeferred;

            }
        };
    });
