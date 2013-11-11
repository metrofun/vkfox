/**
 * Tracking which is based on Google Analytics API
 * see https://developers.google.com/analytics/devguides/collection/protocol/v1/
 */
angular.module('tracker', ['persistent-model'])
    .constant('TRACKER_ID', 'UA-9568575-3');

