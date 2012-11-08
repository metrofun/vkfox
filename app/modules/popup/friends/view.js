define([
    'underscore',
    'backbone',
    'jtoh',
    'mediator/mediator',
    'friends/tpl',
], function (
    _,
    Backbone,
    jtoh,
    Mediator,
    template
) {
    return Backbone.View.extend({
        template: jtoh(template).build(),
        initialize: function () {
            this.$el.append(this.template);
            this.$el.find('.typeahead').typeahead({
                source: [
                    'zzzz',
                    'uuuu'
                ]
            });
        },
        render: function () {
        }
    });
});
