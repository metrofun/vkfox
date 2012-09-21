define(['backbone', 'jtoh', 'jquery', 'item/tpl', 'common/common'], function (Backbone, jtoh, jQuery, template, common) {
    return Backbone.View.extend({
        template: jtoh(template).compile(),
        events: {
            'click .avatar': function () {
                common.openTab(common.addVkBase('/id' + this.model.get('profile').uid));
            }
        },
        initialize: function () {
            this.setElement(jQuery(this.template(this.model.toJSON())).appendTo(this.$el), true);
        }
    });
});
