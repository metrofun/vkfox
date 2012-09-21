define(['jtoh', 'item/tpl', 'item/attachments'], function (jtoh, itemTemplate, attachmentsTemplate) {
    jtoh(itemTemplate).getElementsByClassName('item-content')[0].innerHTML = [
        function (data) {
            var item = data.item;
            return item.text;
        },
        attachmentsTemplate
    ];
    return itemTemplate;
});
