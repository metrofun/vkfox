define([
    'underscore',
    'backbone',
    'jtoh',
    'mediator/mediator',
    'item/view',
    'buddies/item/tpl',
    'jquery.dropdown'
], function (_, Backbone, jtoh, Mediator, ItemView, template) {
    return ItemView.extend(
        {
            template: jtoh(template).compile(),
            initialize: function () {
                ItemView.prototype.initialize.apply(this, arguments);
            }
        }
    );
});
