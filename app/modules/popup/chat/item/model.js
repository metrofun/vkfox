define(['backbone'], function (Backbone) {
    return Backbone.Model.extend({
        initialize: function (model) {
            this.set('profiles', new (Backbone.Collection.extend({
                model: Backbone.Model.extend({
                    idAttribute: 'uid'
                })
            }))(model.profiles));
        }
    });
});
