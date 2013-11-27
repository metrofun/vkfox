var $ = require('zepto');

require('angular').module('app').run(function () {
    $('body').on('click', '[anchor]', function (e) {
        var jTarget = $(e.currentTarget);

        chrome.tabs.create({url: jTarget.attr('anchor')});
    });
});
