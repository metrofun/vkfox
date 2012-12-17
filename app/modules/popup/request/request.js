define(['mediator/mediator', 'underscore'], function (Mediator, _) {
    return {
        api: function () {
            var ajaxDeferred = new jQuery.Deferred(),
                id = _.uniqueId();

            Mediator.pub('request', {
                method: 'api',
                id: id,
                arguments: [].slice.apply(arguments)
            });
            Mediator.sub('request:' + id, function handler(data) {
                Mediator.unsub('request:' + id, handler);

                ajaxDeferred[data.method].apply(ajaxDeferred, data.arguments);
            });

            return ajaxDeferred;
        }
    };
});

