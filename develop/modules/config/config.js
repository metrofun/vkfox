exports.APP_ID =  3807372;
exports.VK_PROTOCOL = 'https://';
exports.VK_BASE = exports.VK_PROTOCOL + 'vk.com/';
exports.AUTH_DOMAIN = exports.VK_PROTOCOL + 'oauth.vk.com/';
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
