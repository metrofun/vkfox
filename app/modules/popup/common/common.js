define(['config/config'], function (config) {
    return {
        addVkBase: function (url) {
            if ((url) && (url.substr(0, 4) !== 'http') && (url.substr(0, 4) !== 'www.')) {
                if (url.charAt(0) === '/') {
                    url = 'http://' + config.vk.domain + url;
                } else {
                    url = 'http://' + config.vk.domain + '/' + url;
                }
            }
            return url;
        },
        openTab: function (url) {
            chrome.tabs.create({
                "url": url
            });
        }
    };
});
