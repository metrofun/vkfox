/*jshint bitwise: false*/
var isPopup = typeof location !== 'undefined' && !~location.href.indexOf('background');

console.log(location.href.indexOf('background'), !~location.href.indexOf('background'));
module.exports = {
    development: true,
    chrome:  true,
    popup: isPopup,
    background: !isPopup
};
