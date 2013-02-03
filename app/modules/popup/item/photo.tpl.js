define(['jtoh', 'jquery', 'item/tpl', 'item/attachments'], function (jtoh, jQuery, itemTemplate, attachmentsTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    tpl.attributes['data-photo-id'] = function (data) {
        return data.item.pid;
    };

    jtoh(tpl).getElementsByClassName('item-content')[0].innerHTML = function (data) {
        data.item = {attachments: [{
            type: 'photo',
            photo: data.item
        }]};
        return attachmentsTemplate;
    };

    return tpl;
});
