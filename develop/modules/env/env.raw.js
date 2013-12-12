/*jshint bitwise: false*/
var isPopup = typeof location !== 'undefined' && ~location.href.indexOf('popup');

module.exports = {
    // @if TARGET === 'FIREFOX'
    firefox:  true,
    // @endif
    // @if TARGET === 'chrome'
    chrome:  true,
    // @endif
    popup: isPopup,
    background: !isPopup,
};
