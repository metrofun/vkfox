define(['jtoh', 'jquery', 'item/tpl'], function (jtoh, jQuery, itemTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    tpl.attributes['data-cid'] = function (data) {
        return data.item.id;
    };
    jtoh(tpl).getElementsByClassName('item-content')[0].innerHTML = function (data) {
        var item = data.item;
        return item.text;
    };

    return tpl;
});
