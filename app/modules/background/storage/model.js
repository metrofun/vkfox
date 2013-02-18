define(['backbone'], function (Backbone) {
    return Backbone.Model.extend({
        initialize: function (attributes, options) {
            var data = localStorage.getItem(options.name);

            if (data) {
                this.set(JSON.parse(data));
            } else {
                this.set(attributes);
            }
            this.name = options.name;
            this.on('change', this.save.bind(this));
        },
        save: function () {
            console.log('save');
            localStorage.setItem(this.name, JSON.stringify(this.toJSON()));
        }
    });
});
