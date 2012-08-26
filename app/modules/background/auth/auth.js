define(['mediator/mediator', 'jtoh', 'auth/tpl', 'jquery', 'backbone'],
    function(Mediator, jtoh, template, jQuery, Backbone) {
        var
        APP_ID = 1920884,
        AUTH_DOMAIN = 'http://oauth.vk.com/',

        AuthModel = Backbone.Model.extend({
            el: document.body,
            defaults: {
                accessToken: undefined,
                userId: undefined
            },
            initialize: function() {
                var loginUrl;

                chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
                    var url = request.location;
                    if (request.from == 'auth/vk.js') {
                        try {
                            this.set('accessToken',  url.match(/access_token=([^&]+)/i)[1]);
                            this.set('userId',  url.match(/user_id=([^&]+)/i)[1]);
                        } catch(e) {
                            // FIXME empty catch?
                        }
                    }
                }.bind(this));
                this.on('change:accessToken', function() {
                    Mediator.pub('auth:success', {
                        accessToken: this.get('accessToken'),
                        userId: this.get('userId')
                    });
                });

                loginUrl = [
                    AUTH_DOMAIN,
                    'authorize?',
                    [
                        'client_id=' + APP_ID,
                        'scope=539774',
                        'redirect_uri=http://oauth.vk.com/blank.html',
                        'response_type=token',
                        'display=popup'
                    ].join('&')
                ].join('');
                this.$iframe = jQuery(jtoh.compile(template)(loginUrl)).appendTo(this.el);
            }
        });

        new AuthModel();
    }
);

