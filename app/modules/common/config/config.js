angular.module('config', [])
    .config(function ($provide) {
        $provide.constant('VK_BASE', 'http://vk.com/');
        $provide.constant('APP_ID', 3807372);
        $provide.constant('AUTH_DOMAIN',  'http://oauth.vk.com/');
        $provide.factory('AUTH_URI', function (AUTH_DOMAIN, APP_ID) {
            return [
                AUTH_DOMAIN,
                'authorize?',
                [
                    'client_id=' + APP_ID,
                    'scope=friends,photos,audio,video,docs,notes,pages,wall,groups,messages,notifications',
                    'response_type=token',
                    'redirect_uri=http://oauth.vk.com/blank.html',
                    'display=page'
                ].join('&')
            ].join('');
        });
    });

