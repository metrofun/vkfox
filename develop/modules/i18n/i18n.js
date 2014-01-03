var DEFAULT_LANGUAGE = 'en',

    _ = require('underscore')._,

    // TODO add belarussian
    i18n = _.extend(
        {},
        require('./ru.js'),
        require('./uk.js'),
        require('./en.js')
    ), language, messages;

try {
    // TODO
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
