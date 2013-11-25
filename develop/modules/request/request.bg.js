var
API_QUERIES_PER_REQUEST = 15,
API_DOMAIN = 'https://api.vk.com/',
API_REQUESTS_DEBOUNCE = 400,
API_VERSION = 4.99,
// XHR_TIMEOUT = 30000,

Vow = require('vow'),
_ = require('underscore')._,
Auth = require('auth/auth.bg.js'),
Eng = require('env/env.js'),
Mediator = require('mediator/mediator.js'),

apiQueriesQueue = [];

if (Eng.firefox) {
    var sdkRequest = require("sdk/request").Request;
}

function HttpError(message) {
    this.name = 'HttpError';
    this.message = message;
}
function AccessTokenError(message) {
    this.name = 'AccessTokenError';
    this.message = message;
}
[HttpError, AccessTokenError].forEach(function (constructor) {
    constructor.prototype = new Error();
    constructor.prototype.constructor = constructor;
});


function xhr(type, url, data) {
    return Auth.getAccessToken().then(function (accessToken) {
        var usedAccessToken = accessToken,
            ajaxPromise = Vow.promise();

        if (Eng.firefox) {
            // TODO implement timeout
            sdkRequest({
                url: url,
                content: data === 'string' ? encodeURIComponent(data):data,
                onComplete: function (response) {
                    if (response.statusText === 'OK') {
                        Auth.getAccessToken().then(function (accessToken) {
                            if (accessToken === usedAccessToken) {
                                ajaxPromise.fulfill(
                                    response.bg.json || response.text
                                );
                            } else {
                                ajaxPromise.reject(new AccessTokenError(response));
                            }
                        });
                    } else {
                        ajaxPromise.reject(new HttpError(response));
                    }
                }
            })[type]();
        } else {
            throw "Not implemented";
        }

        return ajaxPromise;
    });
}

Mediator.sub('request', function (params) {
    Request[params.method].apply(Request, params['arguments']).then(function () {
        Mediator.pub('request:' + params.id, {
            method: 'fulfill',
            'arguments': [].slice.call(arguments)
        });
    }, function () {
        Mediator.pub('request:' + params.id, {
            method: 'reject',
            'arguments': [].slice.call(arguments)
        });
    });
});

var Request = module.exports = {
    get: function (url, data, dataType) {
        return xhr('get', url, data, dataType);
    },
    post: function (url, data, dataType) {
        return xhr('post', url, data, dataType);
    },
    api: function (params) {
        var promise = Vow.promise();
        apiQueriesQueue.push({
            params: params,
            promise: promise
        });
        Request.processApiQueries();
        return promise;
    },
    processApiQueries: _.debounce(function () {
        if (apiQueriesQueue.length) {
            var queriesToProcess = apiQueriesQueue.splice(0, API_QUERIES_PER_REQUEST),
                executeCodeTokens = [], executeCode,  i, method, params;

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
                Request.post([API_DOMAIN, 'method/', method].join(''), {
                    method: 'execute',
                    code: executeCode,
                    access_token: accessToken,
                    v: API_VERSION
                }).then(function (data) {
                    if (data.execute_errors) {
                        console.warn(data.execute_errors);
                    }
                    var response = data.response, i;
                    if (Array.isArray(response)) {
                        for (i = 0; i < response.length; i++) {
                            queriesToProcess[i].promise.fulfill(response[i]);
                        }
                        Request.processApiQueries();
                    } else {
                        console.warn(data);
                        // force relogin on API error
                        Auth.login(true);
                    }
                }, function () {
                    // force relogin on API error
                    Auth.login(true);
                }).done();
            }).done();
        }
    }, API_REQUESTS_DEBOUNCE)
};
