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
        events: {
            'click .t-buddies__toggle-favourite': function (e) {
                var item = jQuery(e.target).parents('.t-buddies__item');

                item.toggleClass('is-favourite');
                Mediator.pub('buddies:favourite:toggle', item.data('uid'));
            },
            'keypress .t-buddies__add-fav-button': function (e) {
                var value, screenName;
                if (e.keyCode === 13) {
                    value = e.currentTarget.value;
                    e.currentTarget.value = '';
                    try {
                        screenName = value.match(/vk\.com\/([\w_]+)/)[1];
                    } catch (e) {}
                    request.api({
                        code: 'return API.resolveScreenName({screen_name: "' + screenName + '"});'
                    }).done(function (response) {
                        var uid;
                        if (response.type === 'user') {
                            uid = response.object_id;
                            Mediator.pub('buddies:favourite:toggle', uid);
                        // } else {
                            // FIXME
                        }
                    });
                }
            }
        },
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
                var view = self.model.get('itemsViews').get(friend.id);

                if (view) {
                    view.get('view').model.set(friend);
                    view.get('view').$el.appendTo(fragment);
                } else {
                    self.model.get('itemsViews').add({
                        id: friend.id,
                        view: new ItemView({
                            el: fragment,
                            model: new Backbone.Model(friend)
                        })
                    });
                }
            });
            this.$el.find('.items').prepend(fragment);
        }
    });
});
