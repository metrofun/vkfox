define(['jtoh', 'jquery', 'item/tpl'], function (jtoh, jQuery, itemTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    tpl.className.push(' t-item--buddie');
    jtoh(tpl).getElementsByClassName('t-item__img')[0].attributes.src = function (data) {
        return data.photo;
    };
    jtoh(tpl).getElementsByClassName('t-item__author')[0].innerHTML = function (data) {
        return [data.first_name, data.last_name].join(' ');
    };
    return tpl;
});
