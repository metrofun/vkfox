define(['item/__attachments.tpl'], function (attachmentsTemplate) {
    return [
        function (data) {
            var item = data.item;
            return item.text;
        },
        attachmentsTemplate
    ];
});
