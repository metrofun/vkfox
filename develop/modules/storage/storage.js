if (typeof localStorage === 'undefined') {
    var ss = require('sdk/simple-storage');

    module.exports = {
        getItem: function (key) {
            return ss.storage[key];
        },
        setItem: function (key, value) {
            ss.storage[key] = value;
        }
    };
} else {
    module.exports = localStorage;
}
