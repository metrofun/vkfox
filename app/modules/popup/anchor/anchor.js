angular.module('anchor', []).run(function () {
    jQuery('body').on('click', '[anchor]', function (e) {
        var jTarget = jQuery(e.currentTarget);

        console.log(jTarget.attr('anchor'));
        chrome.tabs.create({url: jTarget.attr('anchor')});
    });
});
