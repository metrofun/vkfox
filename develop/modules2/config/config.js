angular.module('config', [])
    .config(function ($provide) {
        $provide.constant('APP_ID', 3807372);
        $provide.constant('VK_PROTOCOL', 'https://');
        $provide.factory('VK_BASE', function (VK_PROTOCOL) {
            return VK_PROTOCOL + 'vk.com/';
        });
        $provide.factory('AUTH_DOMAIN', function (VK_PROTOCOL) {
            return VK_PROTOCOL + 'oauth.vk.com/';
        });
        $provide.factory('AUTH_URI', function (AUTH_DOMAIN, APP_ID) {
            return [
                AUTH_DOMAIN,
                'authorize?',
                [
                    'client_id=' + APP_ID,
                    'scope=friends,photos,audio,video,docs,notes,pages,wall,groups,messages,notifications',
                    'response_type=token',
                    'redirect_uri=' + encodeURIComponent('https://oauth.vk.com/blank.html'),
                    'display=page'
                ].join('&')
            ].join('');
        });
    });

