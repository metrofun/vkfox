/**
* Browser specific API: icons, popups, badges etc
*/
angular.module('browser', [])
.constant('IS_CHROME', (function () {
    return !!jQuery.browser.chrome;
})())
.constant('IS_OPERA', (function () {
    return !!jQuery.browser.opera;
})());
