define(['jtoh', 'jquery', 'item/tpl'], function (jtoh, jQuery, itemTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    jtoh(tpl).getElementsByClassName('item-content')[0].innerHTML = function (data) {
        return {tagName: 'i', className: 'icon-heart'};
    };

    return tpl;
});
