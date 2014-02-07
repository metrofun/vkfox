/*jshint bitwise: false */
/*global $ */
var
_ = require('underscore')._,
PersistentModel = require('persistent-model/persistent-model.js'),
I18n = require('i18n/i18n.js'),
Env = require('env/env.js'),
Env = require('env/env.js'),
Browser = require('browser/browser.js'),
Request = require('request/request.js'),
Config = require('config/config.js'),

url = 'http://www.google-analytics.com/collect',
persistentModel = new PersistentModel({}, {name: 'tracker'}),
commonParamsPromise = Browser.getVkfoxVersion().then(function (version) {
    return {
        v: 1, // Version.
        tid: Config.TRACKER_ID, // Tracking ID / Web property / Property ID.
        cid: persistentModel.get('guid'), // Anonymous Client ID.
        ul: I18n.getLang(), //user language
        ap: version //app version
    };
});

/**
 * Creates unique identifier if VKfox instance
 *
 * @see http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
 */
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}
function getBrowserVersion() {
    if (Env.background && Env.firefox) {
        return require('sdk/system').platformVersion;
    } else {
        // we don't user require('zepto')
        // to hack for Firefox's SDK syntax analyzer
        // But we do need, to somewhere include zepto
        return $.browser.version;
    }
}
function getPage() {
    if (Env.background) {
        return '/pages/background.html';
    } else {
        if (location.hash) {
            return location.hash.replace('#', '');
        } else {
            return location.pathname;
        }
    }
}

if (!persistentModel.has('guid')) {
    persistentModel.set('guid', guid());
}

module.exports = {
    trackPage: function () {
        commonParamsPromise.then(function (params) {
            Request.post(url, _.extend({}, params, {
                t: 'pageview',          // Pageview hit type.
                dp: getPage() // Page
            }));
        });
    },
    /**
    * Tracks a custom event
    * @param {String} category
    * @param {String} action
    * @param {String} [label]
    * @param {Number} [value]
    */
    trackEvent: function (category, action, label, value) {
        commonParamsPromise.then(function (params) {
            Request.post(url, _.extend({}, params, {
                t: 'event', // Event hit type
                ec: category, // Event Category. Required.
                ea: action, // Event Action. Required.
                el: label, // Event label.
                ev: value, // Event value.
                dp: getPage() // Page
            }));
        });
    },
    /**
     * Remote debug. All arguments would be send to Analytics.
     *
     * @param {...Mixed} var_args Any number of arguments,
     * that will be sent to Analytics
     */
    debug: function () {
        var args = Array.prototype.slice.call(arguments);

        Browser.getVkfoxVersion().then(function (version) {
            this.trackEvent(
                'debug;v' + version,
                JSON.stringify(args)
            );
        }.bind(this)).done();
    },
    /**
     * Remotely track an error
     *
     * @param {Error} error
     */
    error: function (stack) {
        Browser.getVkfoxVersion().then(function (version) {
            this.trackEvent(
                'error;v' + version,
                stack,
                getBrowserVersion()
            );
        }.bind(this)).done();
    }
};
