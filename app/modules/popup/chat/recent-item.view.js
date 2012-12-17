define([
    'underscore',
    'backbone',
    'jtoh',
    'mediator/mediator',
    'item/view',
    'chat/recent-item.tpl',
    'jquery.dropdown'
], function (_, Backbone, jtoh, Mediator, ItemView, template) {
    return ItemView.extend(
        {
            template: jtoh(template).compile()
        }, {
            toggleFavourite: function ($el) {
                $el.toggleClass('favourite');

                if ($el.hasClass('favourite')) {
                    $el.find('.action-favourite span').text('watched');
                } else {
                    $el.find('.action-favourite span').text('watch');
                }
            },
            update: function ($el) {
            }
        }
    );
});
