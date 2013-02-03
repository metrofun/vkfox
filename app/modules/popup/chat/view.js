define([
    'underscore',
    'backbone',
    'jtoh',
    'mediator/mediator',
    'request/request',
    'chat/tpl',
    'chat/item/view',
    'chat/item/model',
    'jquery.dropdown'
], function (
    _,
    Backbone,
    jtoh,
    Mediator,
    request,
    template,
    ItemView,
    ItemModel
) {
    return Backbone.View.extend({
        template: jtoh(template).build(),
        model: new Backbone.Model({
            itemsViews : new (Backbone.Collection.extend({
                comparator: function (itemView) {
                    var messages = itemView.get('view').model.get('messages');
                    return - messages[messages.length - 1].date;
                }
            }))()
        }),
        events: {
            // 'click .action-favourite': function (e) {
                // var item = jQuery(e.target).parents('.item'),
                    // uid = item.data('owner-id');

                // if (typeof uid !== 'undefined') {
                    // ItemView.toggleFavourite(item);
                // }
            // },
            'click .t-item__action--message, .t-item__content': function (e) {
                var item = jQuery(e.target).parents('.t-item'),
                    uid = item.data('owner-id'),
                    chat_id = item.data('chat-id');

                if (typeof uid !== 'undefined') {
                    ItemView.toggleReply(item, function (value) {
                        var params = {
                            message: jQuery.trim(value)
                        };
                        this.value = '';

                        if (chat_id) {
                            params.chat_id = chat_id;
                        } else {
                            params.uid = uid;
                        }

                        request.api({
                            code: 'return API.messages.send(' + JSON.stringify(params) + ');'
                        });
                        // TODO locale
                    }, 'Private message');
                }
            }
        },
        initialize: function () {
            this.$el.append(this.template);

            Mediator.pub('chat:view');
            Mediator.sub('chat:data', function (data) {
                this.renderDialogs(data.dialogs);
            }.bind(this));
        },
        renderDialogs: function (dialogs) {
            var self = this,
                fragment = document.createDocumentFragment();

            dialogs.forEach(function (dialog) {
                var view = self.model.get('itemsViews').get(dialog.id);

                if (view) {
                    view.get('view').model.set(new ItemModel(dialog).toJSON());
                    view.get('view').$el.appendTo(fragment);
                } else {
                    self.model.get('itemsViews').add({
                        id: dialog.id,
                        view: new ItemView({
                            el: fragment,
                            model: new ItemModel(dialog)
                        })
                    });
                }
            });
            this.$el.find('.items').prepend(fragment);
        },
        renderControls: function () {
            this.$el.find('.dropdown-toggle').dropdown();

            this.$el.find('.typeahead').typeahead({
                source: this.model.get('friends').map(function (friend) {
                    return [friend.get('first_name'), friend.get('last_name')].join(' ');
                })
            });
        },
        // renderFriendsItems: function () {
            // var ITEMS_PER_TICK = 10, $itemsHolder = this.$el.find('.items');

            // // split all friends into chunks
            // _(this.model.get('friends').groupBy(function (friend, i) {
                // return i % ITEMS_PER_TICK;
            // })).forEach(function (collection) {
                // // defer rendering of chunks
                // _.defer(function () {
                    // var fragment = document.createDocumentFragment();

                    // collection.forEach(function (friend) {
                        // var FriendView = new this.FriendView({
                            // el: fragment,
                            // model: new Backbone.Model({
                                // profile: friend.toJSON()
                            // })
                        // });
                    // }, this);

                    // $itemsHolder.append(fragment);
                // }.bind(this));
            // }.bind(this));
        // }
    });
});
