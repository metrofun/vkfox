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
            template: jtoh(template).compile(),
            initialize: function () {
                var self = this;
                this.model.on('change:messages', function () {
                    console.log(template);
                    self.$el.find('.item-content').replaceWith(jtoh(
                        jtoh(template).getElementsByClassName('item-content')[0]
                    ).build(self.model.toJSON()));
                });
                ItemView.prototype.initialize.apply(this, arguments);
            }
        }, {
            toggleFavourite: function ($el) {
                $el.toggleClass('favourite');

                if ($el.hasClass('favourite')) {
                    $el.find('.action-favourite span').text('watched');
                } else {
                    $el.find('.action-favourite span').text('watch');
                }
            }
        }
    );
});
