/**
 * Popup specific tracking
 */
angular.module('tracker').run(function (Tracker, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function () {
        console.log('track');
        Tracker.trackPage();
    });
});
