define([
    'underscore',
    'backbone',
    'jtoh',
    'mediator/mediator',
    'item/view',
    'chat/item/tpl',
    'request/request',
    'chat/i18n',
    'jquery.dropdown'
], function (_, Backbone, jtoh, Mediator, ItemView, template, request, i18n) {
    return ItemView.extend({
        events: {
            'click .t-chat__toggle-message, .t-chat__item .t-item__content': function (e) {
                var item = jQuery(e.target).parents('.t-item'),
                uid = item.data('uid'),
                chatId = item.data('chat-id');

                if (typeof uid !== 'undefined') {
                    this.toggleReply(item, function (value) {
                        var params = {
                            message: jQuery.trim(value)
                        };
                        this.value = '';

                        if (chatId) {
                            params.chat_id = chatId;
                        } else {
                            params.uid = uid;
                        }

                        request.api({
                            code: 'return API.messages.send(' + JSON.stringify(params) + ');'
                        });
                        // TODO locale
                    }, i18n('private-message'));
                }
            }
        },
        template: jtoh(template).compile(),
        initialize: function () {
            var self = this;
            this.model.on('change:messages', function () {
                self.$el.find('.t-item__content').replaceWith(jtoh(
                    jtoh(template).getElementsByClassName('.t-item__content')[0]
                ).build(self.model.toJSON()));
            });
            ItemView.prototype.initialize.apply(this, arguments);
        }
    });
});
