var
API_QUERIES_PER_REQUEST = 15,
API_DOMAIN = 'https://api.vk.com/',
API_REQUESTS_DEBOUNCE = 400,
API_VERSION = 4.99,
XHR_TIMEOUT = 30000,

Vow = require('vow'),
_ = require('underscore')._,
Auth = require('auth/auth.bg.js'),
Env = require('env/env.js'),
Mediator = require('mediator/mediator.js'),

apiQueriesQueue = [];

if (Env.firefox) {
    var sdkRequest = require("sdk/request").Request;
}

// Custom errors
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

/**
 * Convert an object into a query params string
 *
 * @param {Object} params
 *
 * @returns {String}
 */
function querystring(params) {
    var query = [],
        i, key;

    for (key in params) {
        if (params[key] === undefined || params[key] === null)  {
            continue;
        }
        if (Array.isArray(params[key])) {
            for (i = 0; i < params[key].length; ++i) {
                if (params[key][i] === undefined || params[key][i] === null) {
                    continue;
                }
                query.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(params[key][i]));
            }
        } else {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
        }
    }
    return query.join('&');
}

/**
 * XMLHttpRequest onload handler.
 * Checks for an expired accessToken (e.g. a request that completed after relogin)
 *
 * @param {Vow.promise} ajaxPromise Will be resolved or rejected
 * @param {String} usedAccessToken
 * @param {String} responseText
 * @param {String} dataType Is ignored currently
 */
function onLoad(ajaxPromise, usedAccessToken, responseText) {
    Auth.getAccessToken().then(function (accessToken) {
        if (accessToken === usedAccessToken) {
            try {
                ajaxPromise.fulfill(JSON.parse(responseText));
            } catch (e) {
                ajaxPromise.fulfill(responseText);
            }
        } else {
            ajaxPromise.reject(new AccessTokenError());
        }
    });
}

/**
 * Make HTTP Request
 *
 * @param {String} type Post or get
 * @param {String} url
 * @param {Object|String} data to send
 * @param {String} dataType If "json" than reponseText will be parsed and returned as object
 */
function xhr(type, url, data, dataType) {
    return Auth.getAccessToken().then(function (accessToken) {
        var ajaxPromise = Vow.promise(), xhr;

        if (Env.firefox) {
            // TODO implement timeout
            sdkRequest({
                url: url,
                content: data === 'string' ? encodeURIComponent(data):data,
                onComplete: function (response) {
                    if (response.statusText === 'OK') {
                        onLoad(ajaxPromise, accessToken, response.text, dataType);
                    } else {
                        ajaxPromise.reject(new HttpError(response.status));
                    }
                }
            })[type]();
        } else {
            xhr = new XMLHttpRequest();
            xhr.onload = function () {
                onLoad(ajaxPromise, accessToken, xhr.responseText);
            };
            xhr.timeout = XHR_TIMEOUT;
            xhr.onerror = xhr.ontimeout = function (e) {
                ajaxPromise.reject(new HttpError(e));
            };
            type = type.toUpperCase();
            xhr.open(type, url, true);
            if (type === 'POST') {
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            }
            xhr.send(typeof data === 'string' ? data:querystring(data));
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
                }, function (e) {
                    // force relogin on API error
                    Auth.login(true);
                    console.log(e);
                }).done();
            }).done();
        }
    }, API_REQUESTS_DEBOUNCE)
};
