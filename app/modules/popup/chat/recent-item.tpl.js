define([
    'jtoh',
    'jquery',
    'chat/friend-item.tpl',
    'item/attachments'
], function (jtoh, jQuery, friendItemTemplate, attachmentsTemplate) {
    var tpl = jQuery.extend(true, {}, friendItemTemplate),
        avatar = jtoh(tpl).getElementsByClassName('avatar')[0];

    avatar.attributes.src = function (data) {
        if (data.profiles.length === 1) {
            return data.profiles[0].photo;
        }
    };
    avatar.tagName = function (data) {
        return data.profiles.length === 1 ? 'img':'div';
    };
    avatar.innerHTML = function (data) {
        if (data.profiles.length > 1) {
            return [
                {tagName: 'i', className: 'icon-user'},
                data.profiles.length
            ];
        }
    };

    tpl.className[1] = function (data) {
        if (data.profiles.length ===  1) {
            return data.profiles[0].online ? 'online':undefined;
        }
    };
    tpl.className.push(' item-recent');
    tpl.className.push(function (data) {
        if (data.item.read_state === 0) {
            return ' unread';
        }
    });
    tpl.className.push(function (data) {
        if (data.item.out === 1) {
            return ' out';
        }
    });
    tpl.attributes['data-mid'] = function (data) {
        return data.item.mid;
    };
    tpl.attributes['data-chat-id'] = function (data) {
        return data.item.chat_id;
    };
    tpl.attributes['data-owner-id'] = function (data) {
        return data.profiles.length === 1 && data.profiles[0].uid;
    };
    jtoh(tpl).getElementsByClassName('name')[0].innerHTML = function (data) {
        return data.profiles.map(function (profile) {
            return [profile.first_name, profile.last_name].join(' ');
        }).join(', ');
    };
    jtoh(tpl).getElementsByClassName('item-content')[0].innerHTML = [
        function (data) {
            return data.item.body;
        },
        attachmentsTemplate
    ];
    jtoh(tpl).getElementsByClassName('actions')[0].innerHTML = [
        {tagName: 'a', className: 'action action-message', attributes: {href: '#'}, innerHTML: [
            {tagName: 'i', className: 'icon-envelope'}
        ]},
        function (data) {
            if (data.profiles.length === 1 && data.profiles[0].hasOwnProperty('online')) {
                return [' ', {tagName: 'a', className: 'action action-favourite', attributes: {href: '#'}, innerHTML: [
                    {tagName: 'i', className: 'icon-star'}
                ]}];
            }
        }
    ];
    return tpl;
});
