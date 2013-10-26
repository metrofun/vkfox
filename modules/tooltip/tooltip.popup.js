angular.module('tooltip', []).run(function () {
    jQuery('body').tooltip({
        selector: '[title]',
        delay: { show: 1000, hide: false},
        placement: function (tooltip) {
            setTimeout(function () {
                var $tooltip = jQuery(tooltip),
                    $inner = jQuery('.tooltip-inner', tooltip),
                    //if no item, then will return outerWidth of root
                    offset = $tooltip.parents('.item').add(window).outerWidth()
                        - $tooltip.offset().left - $tooltip.width();

                if (offset < 0) {
                    $inner.css({
                        'position': 'relative',
                        'left':  offset + 'px'
                    });
                }
            });
            return 'bottom';
        }
    });

    // Hide popup on click
    jQuery('body').on('show', '[title]', function (e) {
        jQuery(e.target).one('click', function () {
            jQuery(this).data('tooltip').$tip.remove();
        });
    });
});
