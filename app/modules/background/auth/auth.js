angular.module('auth', ['config']).run(function (Auth) {
    Auth.login();
}).factory('Auth', function (Mediator, AUTH_DOMAIN, AUTH_URI, VK_BASE) {
    var RETRY_INTERVAL = 10000, //ms
        CREATED = 1,
        IN_PROGRESS = 1,
        READY = 2,

        $iframe, model = new Backbone.Model(),
        state = CREATED, authDeferred = jQuery.Deferred();

    Mediator.sub('auth:iframe', function (url) {
        // close all login windows
        chrome.tabs.query({url: AUTH_DOMAIN + '*'}, function (tabs) {
            tabs.forEach(function (tab) {
                console.log('remove tab', tab.id);
                chrome.tabs.remove(tab.id);
            });
        });

        try {
            model.set('userId',  parseInt(url.match(/user_id=(\w+)(?:&|$)/i)[1], 10));
            model.set('accessToken',  url.match(/access_token=(\w+)(?:&|$)/i)[1]);

            $iframe.remove();
            // save memory
            $iframe = null;
        } catch (e) {
            // TODO control console.log
            console.log(e);
        }
    }.bind(this));

    Mediator.sub('auth:state:get', function () {
        Mediator.pub('auth:state', state);
    });

    Mediator.sub('auth:relogin', function () {
        resetAuthCookies();
        chrome.tabs.create({url: AUTH_URI});
    });

    model.on('change:accessToken', function () {
        Mediator.pub('auth:success', model.toJSON());
    });

    /**
     * Removes all cookies for auth domain
     */
    function resetAuthCookies() {
        chrome.cookies.getAll({domain: VK_BASE}, function (cookieArray) {
            var i, cookie;
            // remove each cookie
            for (i = 0; i < cookieArray.length; ++i) {
                cookie = cookieArray[i];
                chrome.cookies.remove({ name: cookie.name, url: cookie.path });
            }
        });
    }
    return {
        retry: _.debounce(function () {
            if (state === IN_PROGRESS) {
                this.login(true);
                this.retry();
            }
        }, RETRY_INTERVAL),
        onSuccess: function (data) {
            state = READY;

            chrome.browserAction.setIcon({
                path: {
                    "19": "images/logo19.png",
                    "38": "images/logo38.png"
                }
            });

            authDeferred.resolve(data);
        },
        login: function (force) {
            if (force || state === CREATED) {
                chrome.browserAction.setIcon({
                    path: {
                        "19": "images/logo19_offline.png",
                        "38": "images/logo38_offline.png"
                    }
                });
                state = IN_PROGRESS;

                if (authDeferred.state() === 'resolved') {
                    authDeferred = jQuery.Deferred();
                }

                resetAuthCookies();

                if (!$iframe) {
                    $iframe = angular.element(
                        '<iframe/>',
                        {name : 'vkfox-login-iframe'}
                    ).appendTo('body');
                }
                $iframe.attr('src', AUTH_URI);
                this.retry();

                Mediator.unsub('auth:success', this.onSuccess);
                Mediator.once('auth:success', this.onSuccess);
            }
            return authDeferred;
        },
        getAccessToken: function () {
            return this.login().then(function () {
                return model.get('accessToken');
            });
        },
        getUserId: function () {
            return this.login().then(function () {
                return model.get('userId');
            });
        }
    };
});
