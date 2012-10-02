define(['jtoh', 'jquery', 'item/tpl'], function (jtoh, jQuery, itemTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    jtoh(tpl).getElementsByClassName('item-content')[0].innerHTML = function (data) {
        var item = data.item;
        return item.text;
    };
    jtoh(tpl).getElementsByClassName('item-header')[0].innerHTML.shift();

    return tpl;
});
