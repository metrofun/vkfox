var DEFAULT_LANGUAGE = 'ru',

    _ = require('underscore')._,

    i18n = _.extend(
        {},
        require('./ru.js'),
        require('./uk.js'),
        require('./en.js')
    ), language, messages;

try {
    // language = navigator.language.split('-')[0].toLowerCase();
} catch (e) {}

if (!i18n[language]) {
    language = DEFAULT_LANGUAGE;
}

messages = i18n[language];

module.exports = {
    /**
     * Returns current browser language
     *
     * @returns {String}
     */
    getLang: function () {
        return language;
    },
    /**
     * Returns localized text
     *
     * @param [String] key
     * @param [...Mixed] any number of params
     *
     * @returns {String}
     */
    get: function (key) {
        return messages[key].apply(
            messages,
            [].slice.call(arguments, 1)
        );
    }
};
