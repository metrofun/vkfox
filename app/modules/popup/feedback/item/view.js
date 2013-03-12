define([
    'underscore',
    'backbone',
    'jtoh',
    'mediator/mediator',
    'item/view',
    'feedback/item/tpl',
], function (_, Backbone, jtoh, Mediator, ItemView, template) {
    return ItemView.extend({
        template: jtoh(template).compile(),
        initialize: function () {
            var self = this;

            if (this.model.get('feedbacks')) {
                this.model.on('change:feedbacks', function () {});
            }
            ItemView.prototype.initialize.apply(this, arguments);
        }
    });
});
