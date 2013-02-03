define([
    'underscore',
    'backbone',
    'jtoh',
    'mediator/mediator',
    'request/request',
    'buddies/tpl',
    'buddies/item/view',
    'jquery.dropdown'
], function (
    _,
    Backbone,
    jtoh,
    Mediator,
    request,
    template,
    ItemView
) {
    return Backbone.View.extend({
        template: jtoh(template).build(),
        model: new Backbone.Model({
            itemsViews : new Backbone.Collection()
        }),
        initialize: function () {
            this.$el.append(this.template);

            Mediator.pub('buddies:getData');
            Mediator.sub('buddies:data', function (friends) {
                this.renderFriends(friends);
            }.bind(this));
        },
        renderFriends: function (friends) {
            var self = this,
                fragment = document.createDocumentFragment();

            friends.forEach(function (friend) {
                var view = self.model.get('itemsViews');

                self.model.get('itemsViews').add({
                    id: friend.uid,
                    view: new ItemView({
                        el: fragment,
                        model: new Backbone.Model(friend)
                    })
                });
            });
            this.$el.find('.items').prepend(fragment);
        }
    });
});
