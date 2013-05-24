define([
    'jtoh',
    'jquery',
    'item/tpl',
    'item/__attachment.tpl'
], function (jtoh, jQuery, itemTemplate, attachmentTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);

    jtoh(tpl).getElementsByClassName('t-item__img')[0].attributes.src = function (data) {
        return data.owners[0].photo;
    };
    jtoh(tpl).getElementsByClassName('t-item__author')[0].innerHTML = function (data) {
        var author = data.owners[0];
        return author.id > 0 ? [author.first_name, author.last_name].join(' '):author.name;
    };
    jtoh(tpl).getElementsByClassName('t-item__content')[0].innerHTML = function (data) {
        var attachment = {};
        switch (data.type) {
        case 'photo':
        case 'video':
            attachment.type = data.type;
            attachment[data.type] = data.parent;
            return attachmentTemplate(attachment);
        case 'topic':
            return data.parent.title;
        case 'post':
        case 'comment':
            return [
                data.parent.text,
                (data.parent.attachments || []).map(attachmentTemplate)
            ];
        }
    };

    return tpl;
});
