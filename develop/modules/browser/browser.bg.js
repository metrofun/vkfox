var BADGE_COLOR = [231, 76, 60, 255],
    ICON_ONLINE = {
        "19": "assets/logo19.png",
        "38": "assets/logo38.png"
    },
    ICON_OFFLINE = {
        "19": "assets/logo19_offline.png",
        "38": "assets/logo38_offline.png"
    },

    Vow = require('shim/vow.js'),
    Env = require('env/env.js'),
    _ = require('shim/underscore.js')._,

    Browser, browserAction;

// Set up popup and popup comminication
if (Env.firefox) {
    var data = require('sdk/self').data;

    browserAction = require('browserAction').BrowserAction({
        default_icon: data.url(ICON_ONLINE['19']),
        default_title: 'VKfox',
        default_popup: data.url('pages/popup.html')
    });

    // overcome circular dependencies
    _.defer(function () {
        require('mediator/mediator.js').sub('browser:createTab', function (url) {
            Browser.createTab(url);
        });
    });
} else {
    browserAction = chrome.browserAction;
}

browserAction.setBadgeBackgroundColor({color: BADGE_COLOR});

// overcome circular dependency through Mediator
_.defer(function () {
    require('proxy-methods/proxy-methods.js').connect('browser/browser.bg.js', Browser);
});
module.exports = Browser = {
    getVkfoxVersion: (function () {
        var version = (Env.firefox)
            ? require('sdk/self').version
            : chrome.app.getDetails().version;
        return function () {
            return Vow.fulfill(version);
        };
    })(),
    /**
     * Accessor for browserAction.
     * @returns {Object}
     */
    getBrowserAction: function () {
        return browserAction;
    },
    /**
     * Sets icon to online status
     */
    setIconOnline: function () {
        browserAction.setIcon({path: ICON_ONLINE});
    },
    /**
     * Sets icon to offline status
     */
    setIconOffline: function () {
        browserAction.setIcon({path: ICON_OFFLINE});
    },
    /**
     * @param {String|Number} text
     */
    setBadgeText: function (text) {
        browserAction.setBadgeText({
            text: String(text)
        });
    },
    /**
     * Says whether popup is visible
     *
     * @returns {Boolean}
     */
    isPopupOpened: function () {
        if (Env.firefox) {
            // TODO fix stub
            return false;
        } else {
            return Boolean(chrome.extension.getViews({type: "popup"}).length);
        }
    },
    /**
     * Says whether vk.com is currently active tab
     *
     * @returns {Vow.promise} Returns promise that resolves to Boolean
     */
    isVKSiteActive: (function () {
        var getActiveTabUrl, tabs;

        if (Env.firefox) {
            tabs = require('sdk/tabs');

            getActiveTabUrl = function () {
                return Vow.fulfill(tabs.activeTab.url);
            };
        } else {
            getActiveTabUrl = function () {
                var promise = Vow.promise();
                chrome.tabs.query({active: true}, function (tabs) {
                    if (tabs.length) {
                        promise.fulfill(tabs[0].url);
                    }
                });
                return promise;
            };
        }
        return function () {
            return getActiveTabUrl().then(function (url) {
                return ~url.indexOf('vk.com');
            });
        };
    })(),
    createTab: (function () {
        if (Env.firefox) {
            var tabs = require('sdk/tabs');

            return function (url) {
                tabs.open(url);
            };
        } else {
            return function (url) {
                chrome.tabs.create({url: url});
            };
        }
    })(),
    /**
     * Closes all tabs that contain urlFragment in its url
     */
    closeTabs: (function () {
        return Env.firefox ? function (urlFragment) {
            var tabs = require("sdk/tabs"), index, tab;

            for (index in tabs) {
                tab = tabs[index];

                if (~tab.url.indexOf(urlFragment)) {
                    tab.close();
                }
            }
        } : function (urlFragment) {
            chrome.tabs.query({}, function (tabs) {
                tabs.forEach(function (tab) {
                    if (~tab.url.indexOf(urlFragment)) {
                        chrome.tabs.remove(tab.id);
                    }
                });
            });
        };
    })()
};
