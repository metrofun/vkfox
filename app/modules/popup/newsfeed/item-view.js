define(['backbone', 'jtoh', 'newsfeed/item.tpl'], function (Backbone, jtoh, template) {
    return Backbone.View.extend({
        template: jtoh.compile(template),
        initialize: function () {
            this.$el.append(this.template(this.model.toJSON()));
        }
    });
});
