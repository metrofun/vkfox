define(['jtoh', 'jquery', 'item/tpl'], function (jtoh, jQuery, itemTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    jtoh(tpl).getElementsByClassName('item-content')[0].innerHTML = [
        // TODO localize
        function (data) {
            return [
                'Новых друзей: ', data.count,
                {innerHTML: data.profiles.map(function (profile) {
                    return {tagName: 'a',
                        attributes: {
                            href: '#',
                            rel: 'tooltip',
                            title: [profile.get('first_name'), profile.get('last_name')].join(' ')
                        },
                        innerHTML: {tagName: 'img', attributes: {class: 'avatar', src: profile.get('photo')}}
                    };
                })}
            ];
        }
    ];
    return tpl;
});
