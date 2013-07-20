angular.module('tooltip', []).run(function () {
    jQuery('body').tooltip({
        selector: '[title]',
        delay: { show: 1000, hide: false},
        placement: 'left'
    });

    // Hide popup on click
    jQuery('body').on('show', '[title]', function (e) {
        jQuery(e.target).one('click', function () {
            jQuery(this).data('tooltip').$tip.remove();
        });
    });
});
