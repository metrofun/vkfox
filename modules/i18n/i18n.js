/*global i18n */
angular.module('i18n', [])
    .config(function ($filterProvider, $provide) {
        $provide.factory('I18N', function () {
            var DEFAULT_LANGUAGE = 'ru',
                language = navigator.language.split('-')[0];

            if (!i18n[language]) {
                language = DEFAULT_LANGUAGE;
            }
            return {
                getLang: function () {
                    return language;
                }
            };
        });
        $filterProvider.register('i18n', function (I18N) {
            var messages = i18n[I18N.getLang()];

            return function (input) {
                if (input) {
                    return messages[input].apply(
                        messages,
                        [].slice.call(arguments, 1)
                    );
                }
            };
        });
    });
