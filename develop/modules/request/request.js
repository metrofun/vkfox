var
API_QUERIES_PER_REQUEST = 15,
API_DOMAIN = 'https://api.vk.com/',
API_REQUESTS_DEBOUNCE = 400,
API_VERSION = 4.99,
XHR_TIMEOUT = 30000,

Vow = require('vow'),
_ = require('underscore')._,
Browser = require('modules/browser/browser.js'),
Auth = require('modules/auth/auth.js'),

Request, apiQueriesQueue = [];

if (Browser.firefox) {
    Request = require("sdk/request").Request;
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


function request(type, url, data, dataType) {
    return Auth.getAccessToken().then(function (accessToken) {
        var usedAccessToken = accessToken,
            ajaxPromise = Vow.promise();

        if (Browser.firefox) {
            // TODO implement timeout
            new Request({url: url, onComplete: function (response) {
                if (response.statusText === 'OK') {
                    Auth.getAccessToken().then(function (accessToken) {
                        if (accessToken === usedAccessToken) {
                            ajaxPromise.fulfill(
                                dataType === 'json' ? response.json:response.text
                            );
                        } else {
                            ajaxPromise.reject(new AccessTokenError(response));
                        }
                    });
                } else {
                    ajaxPromise.reject(new HttpError(response));
                }
            }})[type]();
        } else {
            throw "Not implemented";
        }

        return ajaxPromise;
    });
}

module.exports = {
    get: function (url, data, dataType) {
        return request('get', url, data, dataType);
    },
    post: function (url, data, dataType) {
        return request('post', url, data, dataType);
    },
    api: function (params) {
        var promise = Vow.promise();
        apiQueriesQueue.push({
            params: params,
            promise: promise
        });
        this.processApiQueries();
        return promise;
    },
    processApiQueries: _.debounce(function () {
        if (apiQueriesQueue.length) {
            var self = this, queriesToProcess = apiQueriesQueue.splice(0, API_QUERIES_PER_REQUEST),
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
                    if (Array.isArray(response)) {
                        for (i = 0; i < response.length; i++) {
                            queriesToProcess[i].deferred.resolve(response[i]);
                        }
                        self.processApiQueries();
                    } else {
                        console.warn(data);
                        // force relogin on API error
                        Auth.login(true);
                    }
                }, function () {
                    // force relogin on API error
                    Auth.login(true);
                });
            });
        }
    }, API_REQUESTS_DEBOUNCE)
};

