define(['backbone', 'jtoh', 'jquery', 'item/tpl', 'common/common'], function (Backbone, jtoh, jQuery, template, common) {
    return Backbone.View.extend({
        initialize: function () {
            this.setElement(jQuery(this.template(this.model.toJSON())).appendTo(this.$el), true);
        }
    });
});
