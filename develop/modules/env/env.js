/*jshint bitwise: false*/
var isPopup = typeof location !== 'undefined' && ~location.href.indexOf('popup');

module.exports = {
    development: true,
    popup: isPopup,
    background: !isPopup
};
