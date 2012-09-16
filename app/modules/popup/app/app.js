define(['backbone', 'app/app.tpl'], function (Backbone, template) {
    var
    AppView = Backbone.View.extend({
        el: document.body,
        template: template,
        initialize: function () {
            this.$el.append(template());
        }
    }),
    appView = new AppView();
});
