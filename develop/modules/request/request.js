/*jshint bitwise: false*/
var Browser = require('browser/detect.js');

if (Browser.firefox) {
    if (location && ~location.href.indexOf('popup')) {
        return require('./request.pu.js');
    } else {
        return require('./request.bg.js');
    }
} else {
    throw 'not implemented';
}
