/**
 * Browser specific API: icons, popups, badges etc
 */
angular.module('browser')
.config(function () {
    chrome.browserAction.setBadgeBackgroundColor({
        color: [231, 76, 60, 255]
    });
})
.constant('BROWSER_ICON_ONLINE', {
    "19": "/assets/logo19.png",
    "38": "/assets/logo38.png"
})
.constant('BROWSER_ICON_OFFLINE', {
    "19": "/assets/logo19_offline.png",
    "38": "/assets/logo38_offline.png"
})
.factory('Browser', function () {
    return {
        /**
         * Sets plugin icon to online or offline
         *
         * @param {Number} icon
         */
        setIcon: function (icon) {
            chrome.browserAction.setIcon({
                path: icon
            });
        },
        /**
         * @param {String|Number} text
         */
        setBadgeText: function (text) {
            chrome.browserAction.setBadgeText({
                text: String(text)
            });
        },
        /**
         * Says whether popup is visible
         *
         * @returns {Boolean}
         */
        isPopupOpened: function () {
            return Boolean(chrome.extension.getViews({type: "popup"}).length);
        },
        /**
         * Says whether vk.com is currently active tab
         *
         * @returns {jQuery.Deferred} Returns promise that resolves to Boolean
         */
        isVKSiteActive: function () {
            var deferred = jQuery.Deferred();

            chrome.tabs.query({active: true}, function (tabs) {
                if (tabs.every(function (tab) {
                    return tab.url.indexOf('vk.com') === -1;
                })) {
                    deferred.resolve(false);
                } else {
                    deferred.resolve(true);
                }
            });

            return deferred;
        }
    };
});
