/*jshint bitwise: false*/
var isPopup = typeof location !== 'undefined' && ~location.href.indexOf('popup');

module.exports = {
    // popup/background environment
    popup: isPopup,
    background: !isPopup,
    // browser environment
    // chrome: true
    firefox:  true
};
