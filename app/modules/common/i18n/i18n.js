/*global i18n */
angular.module('i18n', [])
    .config(function ($filterProvider) {
        $filterProvider.register('i18n', function () {
            var DEFAULT_LANGUAGE = 'ru',
                language = navigator.language.split('_')[0],
                messages;

            messages = i18n[language];

            if (!messages) {
                messages = i18n[DEFAULT_LANGUAGE];
            }

            return function (input) {
                if (input) {
                    console.log([].slice.call(arguments, 1));
                    return messages[input].apply(
                        messages,
                        [].slice.call(arguments, 1)
                    );
                }
            };
        });
    });
