var data = require('sdk/self').data,
    badge = require('browserAction').BrowserAction({
        default_icon: data.url('/assets/logo19_offline.png'),
        default_title: 'VKfox',
        default_popup: data.url('firefox/pages/popup.html')
    });

exports = {
    /**
     * Sets plugin icon to online or offline
     *
     * @param {Number} icon
     */
    setIcon: function (icon) {
        badge.setIcon({
            path: icon
        });
    },
    /**
     * @param {String|Number} text
     */
    setBadgeText: function () {
    },
    /**
     * Says whether popup is visible
     *
     * @returns {Boolean}
     */
    isPopupOpened: function () {
    },
    /**
     * Says whether vk.com is currently active tab
     *
     * @returns {jQuery.Deferred} Returns promise that resolves to Boolean
     */
    isVKSiteActive: function () {
    }
};
