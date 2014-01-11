var $ = require('zepto'),
    Browser = require('browser/browser.js');

$(document).on('click', '[anchor]', function (e) {
    var jTarget = $(e.currentTarget);

    Browser.createTab(jTarget.attr('anchor'));
});
