define([
    'underscore',
    'backbone',
    'jtoh',
    'updates/tpl',
    'storage/model',
    'jquery.button'
], function (
    _,
    Backbone,
    jtoh,
    template,
    StorageModel
) {
    return Backbone.View.extend({
        model: new StorageModel({
            activeTab: 'feedback',
        }, {name: 'updates'}),
        template: jtoh(template),
        initialize: function () {
            var self = this;
            this.$el.append(this.template.build(this.model.toJSON()));
            this.$el.find('.t-updates__controls').on('shown', function (e) {
                var tabName = e.target.hash.match(/__(\w+)/)[1];
                self.model.set('activeTab', tabName);
            });
        }
    });
});
