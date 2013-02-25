define([
    'jtoh',
    'jquery',
    'item/tpl',
    'buddies/i18n'
], function (jtoh, jQuery, itemTemplate, i18n) {
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
        if (data.watched) {
            classTokens.push('is-watched');
        }
        return classTokens.join(' ');
    });
    jtoh(tpl).getElementsByClassName('t-item__img')[0].attributes.src = function (data) {
        return data.photo;
    };
    jtoh(tpl).getElementsByClassName('t-item__author')[0].innerHTML = function (data) {
        return [data.first_name, data.last_name].join(' ');
    };
    jtoh(tpl).getElementsByClassName('t-item__actions')[0].innerHTML = (function () {
        var elements = [
            {name: 'toggle-watch', icon: 'icon-eye-open', title: i18n('watch-online-status')},
            {name: 'toggle-favourite', icon: 'icon-star', title: i18n('favourite')}
        ];

        return elements.map(function (element) {
            return {
                tagName: 'i',
                attributes: {
                    title: element.title,
                    class: 't-item__action t-buddies__' + element.name + ' ' + element.icon
                }
            };
        });
    }());
    return tpl;
});
