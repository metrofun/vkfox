/*jshint bitwise: false*/
var isPopup = typeof location !== 'undefined' && !~location.href.indexOf('background');

module.exports = {
    development: true,
    chrome:  true,
    popup: isPopup,
    background: !isPopup
};
