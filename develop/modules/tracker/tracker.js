/*jshint bitwise: false */
/**
 * Tracking which is based on Google Analytics API
 * see https://developers.google.com/analytics/devguides/collection/protocol/v1/
 */
angular.module('tracker')
    .factory('Tracker', function (TRACKER_ID, PersistentModel) {
        var url = 'http://www.google-analytics.com/collect',
            persistentModel = new PersistentModel({}, {name: 'tracker'}),
            requiredParams;

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

        if (!persistentModel.has('guid')) {
            persistentModel.set('guid', guid());
        }

        requiredParams = {
            v: 1,               // Version.
            tid: TRACKER_ID,    // Tracking ID / Web property / Property ID.
            cid: persistentModel.get('guid'), // Anonymous Client ID.
            ul: navigator.language, //user language
            ap: chrome.app.getDetails().version //app version
        };

        return {
            trackPage: function () {
                jQuery.post(url, _.extend({}, requiredParams, {
                    t: 'pageview',          // Pageview hit type.
                    dh: location.hostname,  // Document hostname.
                    dp: location.pathname  // Page
                }));
            },
            /**
             * Tracks a custom event
             * @param {String} category
             * @param {String} action
             * @param {String} [label]
             * @param {Number} [value]
             */
            trackEvent: function (category, action, label, value) {
                jQuery.post(url, _.extend({}, requiredParams, {
                    t: 'event', // Event hit type
                    ec: category, // Event Category. Required.
                    ea: action, // Event Action. Required.
                    el: label, // Event label.
                    ev: value, // Event value.
                    dh: location.hostname,  // Document hostname.
                    dp: location.pathname  // Page
                }));
            }
        };
    })
    .run(function (Tracker) {
        Tracker.trackPage();

        //error reporting
        window.onerror = function (message, filename, lineno, colno, error) {
            if (error) {
                Tracker.trackEvent(
                    'errors;v' + chrome.app.getDetails().version,
                    error.stack,
                    navigator.userAgent
                );
            }
        };
    });

