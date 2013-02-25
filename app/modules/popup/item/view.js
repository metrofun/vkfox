define([
    'backbone.bemview',
    'jtoh',
    'jquery',
    'item/tpl',
    'common/common'
], function (Backbone, jtoh, jQuery, template, common) {
    return Backbone.BEMView.extend({
        initialize: function () {
            this.setElement(jQuery(this.template(this.model.toJSON())).appendTo(this.el), true);
        }
    }, {
        toggleReply: function toggleReply($el, callback, placeholder) {
            if ($el.find('.item-reply').length === 0) {
                $el.append(jtoh({
                    className: 'item-reply',
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
                $el.find('.item-reply').remove();
            }
        }
    });
});
