define([
    'jtoh',
    'mediator/mediator',
    'item/view',
    'buddies/item/tpl',
    'jquery.tooltip'
], function (jtoh, Mediator, ItemView, template) {
    return ItemView.extend({
        events: {
            'click .t-buddies__toggle-watch': function (e) {
                this.$el.toggleClass('is-watched');
                Mediator.pub('buddies:watched:toggle', this.$el.data('uid'));
            },
            'click .t-buddies__toggle-favourite': function (e) {
                this.$el.toggleClass('is-favourite');
                Mediator.pub('buddies:favourite:toggle', this.$el.data('uid'));
            }
        },
        template: jtoh(template).compile(),
        initialize: function () {
            ItemView.prototype.initialize.apply(this, arguments);
        }
    });
});
