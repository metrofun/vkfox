angular.module('anchor', []).run(function () {
    jQuery('body').on('click', '[anchor]', function (e) {
        var jTarget = jQuery(e.currentTarget);

        chrome.tabs.create({url: jTarget.attr('anchor')});
    });
});
