angular.module('i18n', [])
    .config(function ($filterProvider) {
        var DEFAULT_LANGUAGE = 'ru',
            language = navigator.language.split('_')[0],
            messages;

        messages = i18n[language];

        if (!messages) {
            messages = i18n[DEFAULT_LANGUAGE];
        }

        $filterProvider.register('i18n', function (input) {
            if (input) {
                return messages[input].apply(
                    messages,
                    [].slice.call(arguments, 1)
                )
            }
        });
    });
