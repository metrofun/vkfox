define(['backbone'], function (Backbone) {
    return Backbone.Model.extend({
        initialize: function (attributes, options) {
            this.name = options.name;
            this.on('change', this.save.bind(this));
        },
        save: function () {
            localStorage.setItem(this.name, this.toJSON());
        }
    });
});
