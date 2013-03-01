define([
    'underscore',
    'backbone',
    'jtoh',
    'mediator/mediator',
    'item/view',
    'chat/item/tpl',
    'jquery.dropdown'
], function (_, Backbone, jtoh, Mediator, ItemView, template) {
    return ItemView.extend(
        {
            template: jtoh(template).compile(),
            initialize: function () {
                var self = this;
                this.model.on('change:messages', function () {
                    self.$el.find('.t-item__content').replaceWith(jtoh(
                        jtoh(template).getElementsByClassName('.t-item__content')[0]
                    ).build(self.model.toJSON()));
                });
                ItemView.prototype.initialize.apply(this, arguments);
            }
        }
    );
});
