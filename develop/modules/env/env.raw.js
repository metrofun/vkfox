/*jshint bitwise: false*/
var isPopup = typeof location !== 'undefined' && ~location.href.indexOf('popup');

module.exports = {
    // @if ENV === 'PRODUCTION'
    production: true,
    // @endif
    // @if ENV === 'DEVELOPMENT'
    development: true,
    // @endif
    // @if TARGET === 'FIREFOX'
    firefox:  true,
    // @endif
    // @if TARGET === 'chrome'
    chrome:  true,
    // @endif
    popup: isPopup,
    background: !isPopup
};
