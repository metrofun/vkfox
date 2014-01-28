var $ = require('zepto');

require('bootstrapTooltip');

$(document).tooltip({
    selector: '[title]',
    delay: { show: 1000, hide: false},
    placement: function (tooltip) {
        setTimeout(function () {
            var $tooltip = $(tooltip),
                $inner = $('.tooltip-inner', tooltip),
                //if no item, then will return outerWidth of root
                offset = $tooltip.parents('.item').add(window).width()
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
$(document).on('show', '[title]', function (e) {
    $(e.target).one('click', function () {
        $(this).data('tooltip').$tip.remove();
    });
});
