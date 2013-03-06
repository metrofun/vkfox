define([
    'jtoh',
    'jquery',
    'item/tpl',
    'item/attachments'
], function (jtoh, jQuery, itemTemplate, attachmentsTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);

    jtoh(tpl).getElementsByClassName('t-item__img')[0].attributes.src = function (data) {
        return data.owners[0].photo;
    };
    jtoh(tpl).getElementsByClassName('t-item__author')[0].innerHTML = function (data) {
        var author = data.owners[0];
        return author.id > 0 ? [author.first_name, author.last_name].join(' '):author.name;
    };

    return tpl;
});
