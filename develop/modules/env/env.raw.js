/*jshint bitwise: false*/
var isPopup = typeof location !== 'undefined' && !~location.href.indexOf('background');

module.exports = {
    // @if TARGET === 'FIREFOX'
    firefox:  true,
    // @endif
    // @if TARGET === 'CHROME'
    chrome:  true,
    // @endif
    // @if TARGET === 'OPERA'
    opera:  true,
    // @endif
    popup: isPopup,
    background: !isPopup
};
