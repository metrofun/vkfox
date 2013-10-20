/**
 * Tracking which is based on Google Analytics API
 * see https://developers.google.com/analytics/devguides/collection/protocol/v1/
 */
angular.module('tracker', [])
    .constant('TRACKER_ID', 'UA-9568575-2')
    .factory('Tracker', function (TRACKER_ID) {
        var url = 'http://www.google-analytics.com/collect',
            requiredParams = {
                v: 1,               // Version.
                tid: TRACKER_ID,    // Tracking ID / Web property / Property ID.
                cid: 555            // Anonymous Client ID.
            };

        return {
            trackPage: function () {
                jQuery.post(url, _.extend({}, requiredParams, {
                    t: 'pageview',          // Pageview hit type.
                    dh: location.hostname,  // Document hostname.
                    dp: location.pathname,  // Page.
                    dt: document.title      // Title.
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
                    ev: value
                }));
            }
        };
    })
    .run(function (Tracker) {
        Tracker.trackPage();

        //error reporting
        window.onerror = function (message, filename, lineno, colno, error) {
            if (error) {
                //category - 'errors', action - app version, label - error stack
                Tracker.trackEvent('errors', chrome.app.getDetails().version, error.stack);
            }
        };
    });

