define([
    'jtoh',
    'jquery',
    'item/tpl',
    'item/__content.post.tpl',
    'item/__attachments.tpl'
], function (jtoh, jQuery, itemTemplate, postContentTemplate, attachmentsTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);

    jtoh(tpl).getElementsByClassName('t-item__img')[0].attributes.src = function (data) {
        return data.owners[0].photo;
    };
    jtoh(tpl).getElementsByClassName('t-item__author')[0].innerHTML = function (data) {
        var author = data.owners[0];
        return author.id > 0 ? [author.first_name, author.last_name].join(' '):author.name;
    };
    jtoh(tpl).getElementsByClassName('t-item__content')[0].innerHTML = function (data) {
        switch (data.type) {
        case 'post':
            return postContentTemplate;
        }
    };

    return tpl;
});
