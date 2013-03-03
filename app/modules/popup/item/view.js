define([
    'backbone',
    'jtoh',
    'jquery',
    'item/tpl',
    'common/common'
], function (Backbone, jtoh, jQuery, template, common) {
    return Backbone.View.extend({
        toggleReply: function ($el, callback, placeholder) {
            var reply = $el.find('.t-item__reply');
            if (reply.length === 0) {
                $el.append(jtoh({
                    className: 't-item__reply',
                    innerHTML: {tagName: 'textarea', attributes: {
                        placeholder: placeholder || undefined
                    }}
                }).build()).find('textarea').focus().keypress(function (e) {
                    if (!e.ctrlKey  && e.keyCode === 13) {
                        callback.call(this, this.value);
                        e.preventDefault();
                    }
                });
            } else {
                reply.remove();
            }
        },
        initialize: function () {
            this.setElement(jQuery(this.template(this.model.toJSON())).appendTo(this.el), true);
        }
    });
});
