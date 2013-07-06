angular.module('auth', []).factory('Auth', function (Mediator) {
    var APP_ID = 1920884,
        AUTH_DOMAIN = 'http://oauth.vk.com/',
        RETRY_INTERVAL = 10000,
        AUTH_URI = [
            AUTH_DOMAIN,
            'authorize?',
            [
                'client_id=' + APP_ID,
                'scope=539774',
                'redirect_uri=http://oauth.vk.com/blank.html',
                'response_type=token',
                'display=wap'
            ].join('&')
        ].join(''),
        CREATED = 1,
        IN_PROGRESS = 1,
        READY = 2,

        $iframe, model = new Backbone.Model(),
        state = CREATED, authDeferred = jQuery.Deferred();

    // FIXME http://code.google.com/p/chromium/issues/detail?id=63122
    chrome.extension.onRequest.addListener(function () {});

    Mediator.sub('auth:iframe', function (url) {
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

    model.on('change:accessToken', function () {
        Mediator.pub('auth:success', model.toJSON());
    });

    return {
        retry: _.debounce(function () {
            if (state === IN_PROGRESS) {
                this.login(true);
                this.retry();
            }
        }, RETRY_INTERVAL),
        onSuccess: function (data) {
            state = READY;

            authDeferred.resolve(data);
        },
        login: function (force) {
            if (force || state === CREATED) {
                state = IN_PROGRESS;

                authDeferred.reject('relogin');
                authDeferred = jQuery.Deferred();

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
                console.log(model.get('userId'));
                return model.get('userId');
            });
        }
    };
});
