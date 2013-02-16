define(['underscore', 'mediator/mediator', 'jtoh', 'auth/tpl', 'jquery', 'backbone'],
    function (_, Mediator, jtoh, template, jQuery, Backbone) {
        var
        APP_ID = 1920884,
        AUTH_DOMAIN = 'http://oauth.vk.com/',
        RETRY_INTERVAL = 10000;

        return Backbone.Model.extend({
            el: document.body,
            defaults: {
                accessToken: undefined,
                userId: undefined
            },
            authURL: [
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
            initialize: function () {
                // FIXME http://code.google.com/p/chromium/issues/detail?id=63122
                chrome.extension.onRequest.addListener(function () {});

                Mediator.sub('auth:login', this.login.bind(this));
                Mediator.sub('auth:iframe', function (url) {
                    try {
                        this.set('userId',  parseInt(url.match(/user_id=(\w+)(?:&|$)/i)[1], 10));
                        // save memory
                        this.set('accessToken',  url.match(/access_token=(\w+)(?:&|$)/i)[1]);
                        this.$iframe.remove();
                        delete this.$iframe;
                    } catch (e) {
                        // FIXME control console.log
                        console.log(e);
                    }
                }.bind(this));

                this.on('change:accessToken', function () {
                    Mediator.pub('auth:success', {
                        accessToken: this.get('accessToken'),
                        userId: this.get('userId')
                    });
                });

                this.login();
            },
            retry: _.debounce(function () {
                if (this.$iframe) {
                    // reload iframe
                    this.$iframe.attr('src', this.authURL);
                    this.retry();
                }
            }, RETRY_INTERVAL),
            login: function () {
                if (!this.$iframe) {
                    this.$iframe = jQuery(jtoh(template).build(this.authURL));
                } else {
                    this.$iframe.attr('src', this.authURL);
                }
                this.$iframe.appendTo(this.el);

                this.retry();
            }
        });
    }
);

