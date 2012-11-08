define(['jtoh', 'jquery', 'item/tpl', 'item/attachments'], function (jtoh, jQuery, itemTemplate, attachmentsTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    tpl.attributes['data-vid'] = function (data) {
        return data.item.id;
    };

    jtoh(tpl).getElementsByClassName('item-content')[0].innerHTML = function (data) {
        data.item = {attachments: [{
            type: 'video',
            video: data.item
        }]};
        return attachmentsTemplate;
    };

    return tpl;
});
