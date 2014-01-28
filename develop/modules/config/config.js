var Env = require('env/env.js');

exports.APP_ID = 3807372;
if (Env.firefox) {
    exports.TRACKER_ID = 'UA-9568575-4';
} else if (Env.chrome) {
    exports.TRACKER_ID = 'UA-9568575-2';
} else {
    exports.TRACKER_ID = 'UA-9568575-3';
}
exports.VK_PROTOCOL = 'https://';
exports.VK_BASE = exports.VK_PROTOCOL + 'vk.com/';
// HTTPS only
// @see http://vk.com/pages?oid=-1&p=%D0%92%D1%8B%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%BE%D0%B2_%D0%BA_API
exports.AUTH_DOMAIN = 'https://oauth.vk.com/';
exports.AUTH_URI = [
    exports.AUTH_DOMAIN,
    'authorize?',
    [
        'client_id=' + exports.APP_ID,
        'scope=friends,photos,audio,video,docs,notes,pages,wall,groups,messages,notifications',
        'response_type=token',
        'redirect_uri=' + encodeURIComponent('https://oauth.vk.com/blank.html'),
        'display=page'
    ].join('&')
].join('');
