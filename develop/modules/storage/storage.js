var Browser = require('modules/browser/browser.js');

if (Browser.firefox) {
    var storage = require("sdk/simple-storage");

    module.exports = {
        getItem: function (key) {
            return storage[key];
        },
        setItem: function (key, value) {
            storage[key] = value;
        }
    };
} else {
    module.exports = localStorage;
}


