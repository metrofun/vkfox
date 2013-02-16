define(['jtoh', 'jquery', 'item/tpl'], function (jtoh, jQuery, itemTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    tpl.attributes['data-uid'] = function (data) {
        return data.uid;
    };
    tpl.className.push(function (data) {
        var classTokens = [' t-buddies__item'];

        if (data.online) {
            classTokens.push('is-online');
        }
        if (data.favourite) {
            classTokens.push('is-favourite');
        }
        return classTokens.join(' ');
    });
    jtoh(tpl).getElementsByClassName('t-item__img')[0].attributes.src = function (data) {
        return data.photo;
    };
    jtoh(tpl).getElementsByClassName('t-item__author')[0].innerHTML = function (data) {
        return [data.first_name, data.last_name].join(' ');
    };
    jtoh(tpl).getElementsByClassName('t-item__actions')[0].innerHTML = [
        {
            tagName: 'a',
            className: 't-item__action t-buddies__toggle-favourite',
            attributes: {href: '#'},
            innerHTML: [
                {tagName: 'i', className: 'icon-star'}
            ]
        }
    ];
    return tpl;
});
