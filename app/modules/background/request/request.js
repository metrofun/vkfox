define(['jquery', 'mediator/mediator', 'underscore'], function(jQuery, Mediator, _) {
    var
    API_QUERIES_PER_REQUEST = 15,
    API_DOMAIN = 'https://api.vk.com/',
    API_REQUESTS_DEBOUNCE = 400,

    accessToken, apiQueriesQueue= [];

    Mediator.sub('auth:success', function(data){
        accessToken = data.accessToken;
    });

    return {
        ajax: function(url, options) {
            var success, error, _accessToken = accessToken,
                 ajaxDeferred = new jQuery.Deferred();

            if (typeof url === "object") {
                options = url;
                url = undefined;
            }
            options = options || {};
            if (options.success) {
                success = options.success;
                delete options.success;
            }
            if (options.success) {
                error = options.error;
                delete options.error;
            }
            jQuery.ajax(options).then(
                function() {
                    if (accessToken === _accessToken) {
                        ajaxDeferred.resolve.apply(ajaxDeferred, arguments);
                    } else {
                        ajaxDeferred.reject.apply(ajaxDeferred, arguments);
                    }
                },
                function() {
                    ajaxDeferred.reject.apply(ajaxDeferred, arguments);
                }
            );
            return ajaxDeferred.done(success).fail(error);
        },
        get: function (url, data, callback, type) {
            // shift arguments if data argument was omitted
            if (jQuery.isFunction(data)) {
                type = type || callback;
                callback = data;
                data = undefined;
            }

            return this.ajax({
                url: url,
                data: data,
                success: callback,
                dataType: type
            });
        },
        post: function (url, data, callback, type) {
            // shift arguments if data argument was omitted
            if (jQuery.isFunction(data)) {
                type = type || callback;
                callback = data;
                data = undefined;
            }

            return this.ajax({
                url: url,
                data: data,
                success: callback,
                dataType: type
            });
        },
        api: function(params, callback) {
            var queryDeferred = new jQuery.Deferred();
            apiQueriesQueue.push({
                params: params,
                deferred: queryDeferred
            });
            this.processApiQueries();
            return queryDeferred.done(callback);
        },
        processApiQueries: _.debounce(function() {
            if (apiQueriesQueue.length) {
                var queriesToProcess = apiQueriesQueue.slice(0, API_QUERIES_PER_REQUEST),
                    executeCodeTokens = [], executeCode,  i, method, params;

                apiQueriesQueue = apiQueriesQueue.slice(API_QUERIES_PER_REQUEST);
                for (i = 0; i < queriesToProcess.length; i++) {
                    params = queriesToProcess[i].params;
                    method = params.method || 'execute';

                    if (params.method) {
                        method = params.method;
                        delete params.method;
                    }

                    if (method === 'execute') {
                        executeCodeTokens.push( params.code.replace(/^return\s*|;$/g, '') );
                    } else {
                        // TODO not implemented
                        throw 'not implemented';
                    }
                }
                executeCode = 'return [' + executeCodeTokens + '];';

                this.post(
                    [API_DOMAIN, 'method/', method].join(''),
                    {
                        method: 'execute',
                        code: executeCode,
                        access_token: accessToken
                    },
                    function(data) {
                        var response = data.response, i;
                        for (i=0; i < response.length; i++) {
                            queriesToProcess[i].deferred.resolve(response[i]);
                        }
                        this.processApiQueries();
                    }.bind(this)
                );
            }
        }, API_REQUESTS_DEBOUNCE)
    }
});

