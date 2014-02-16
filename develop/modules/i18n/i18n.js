var DEFAULT_LANGUAGE = 'en',

    _ = require('shim/underscore.js')._,

    i18n = _.extend(
        {},
        require('./ru.js'),
        require('./uk.js'),
        require('./en.js')
    ), language, locale, messages, chr, Ci, Cc;

// Show russian locale for belorus
i18n.be = i18n.ru;

if (typeof navigator !== 'undefined') {
    locale = navigator.language;
} else {
    chr = require("chrome");
    Cc = chr.Cc;
    Ci = chr.Ci;
    locale = Cc["@mozilla.org/chrome/chrome-registry;1"]
        .getService(Ci.nsIXULChromeRegistry).getSelectedLocale("global");
}
try {
    language = locale.split('-')[0].toLowerCase();
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
