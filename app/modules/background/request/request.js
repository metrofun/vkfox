angular.module('request', ['mediator', 'auth']).factory(
    'Request',
    function (Auth, Mediator) {
        var
        API_QUERIES_PER_REQUEST = 15,
        API_DOMAIN = 'https://api.vk.com/',
        API_REQUESTS_DEBOUNCE = 400,
        API_VERSION = 4.99,

        apiQueriesQueue = [],
        Request = {
            /*
             * Makes ajax request and fails if login changed
             *
             * @param [Object] options See jQuery.ajax()
             *
             * @returns [jQuery.Deferred]
             */
            ajax: function (options) {
                return Auth.getAccessToken().then(function (accessToken) {
                    var usedAccessToken = accessToken,
                        ajaxDeferred = jQuery.Deferred();

                    jQuery.ajax(options).then(
                        function (response) {
                            Auth.getAccessToken().then(function (accessToken) {
                                if (accessToken === usedAccessToken) {
                                    ajaxDeferred.resolve.call(ajaxDeferred, response);
                                } else {
                                    ajaxDeferred.reject.call(ajaxDeferred, response);
                                }
                            });
                        },
                        function (response) {
                            console.log('wtf', arguments);
                            ajaxDeferred.reject.call(ajaxDeferred, response);
                        }
                    );
                    return ajaxDeferred;
                });
            },
            get: function (url, data, dataType) {
                return this.ajax({
                    method: 'GET',
                    url: url,
                    data: data,
                    dataType: dataType
                });
            },
            post: function (url, data, dataType) {
                return this.ajax({
                    method: 'POST',
                    url: url,
                    data: data,
                    dataType: dataType
                });
            },
            api: function (params) {
                var deferred = jQuery.Deferred();
                apiQueriesQueue.push({
                    params: params,
                    deferred: deferred
                });
                this.processApiQueries();
                return deferred;
            },
            processApiQueries: _.debounce(function () {
                if (apiQueriesQueue.length) {
                    var self = this, queriesToProcess = apiQueriesQueue.slice(0, API_QUERIES_PER_REQUEST),
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
                            executeCodeTokens.push(params.code.replace(/^return\s*|;$/g, ''));
                        } else {
                            // TODO not implemented
                            throw 'not implemented';
                        }
                    }
                    executeCode = 'return [' + executeCodeTokens + '];';

                    Auth.getAccessToken().then(function (accessToken) {
                        self.post([API_DOMAIN, 'method/', method].join(''), {
                            method: 'execute',
                            code: executeCode,
                            access_token: accessToken,
                            v: API_VERSION
                        }).then(function (data) {
                            if (data.execute_errors) {
                                console.warn(data.execute_errors);
                            }
                            var response = data.response, i;
                            for (i = 0; i < response.length; i++) {
                                queriesToProcess[i].deferred.resolve(response[i]);
                            }
                            self.processApiQueries();
                        });
                    });
                }
            }, API_REQUESTS_DEBOUNCE)
        };

        // Mediator.sub('auth:success', function (data) {
            // accessToken = data.accessToken;
        // });
        Mediator.sub('request', function (params) {
            Request[params.method].apply(Request, params['arguments']).then(function () {
                Mediator.pub('request:' + params.id, {
                    method: 'resolve',
                    'arguments': [].slice.call(arguments)
                });
            }, function () {
                Mediator.pub('request:' + params.id, {
                    method: 'reject',
                    'arguments': [].slice.call(arguments)
                });
            });
        });

        return Request;
    });
