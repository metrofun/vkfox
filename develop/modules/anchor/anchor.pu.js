var $ = require('zepto');

$(document).on('click', '[anchor]', function (e) {
    var jTarget = $(e.currentTarget);

    chrome.tabs.create({url: jTarget.attr('anchor')});
});
