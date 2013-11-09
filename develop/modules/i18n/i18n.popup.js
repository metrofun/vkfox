/*global i18n */
angular.module('i18n').run(function (I18N) {
    moment.lang(I18N.getLang());
});
