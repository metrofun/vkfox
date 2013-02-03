define(['jtoh', 'jquery', 'item/tpl', 'item/attachments'], function (jtoh, jQuery, itemTemplate, attachmentsTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);

    tpl.attributes['data-pid'] = function (data) {
        return data.item.id;
    };
    jtoh(tpl).getElementsByClassName('item-content')[0].innerHTML = [
        function (data) {
            var item = data.item;
            return item.text;
        },
        attachmentsTemplate
    ];
    return tpl;
});
