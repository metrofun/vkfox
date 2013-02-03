define([
    'jtoh',
    'jquery',
    'item/tpl',
    'item/attachments'
], function (jtoh, jQuery, itemTemplate, attachmentsTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate),
        avatar = jtoh(tpl).getElementsByClassName('t-item__img')[0],
        content = jtoh(tpl).getElementsByClassName('t-item__content')[0];

    avatar.attributes.src = function (data) {
        var companionProfile;
        if (!data.chat_id) {
            return data.profiles.get(data.uid).get('photo');
        }
    };
    avatar.tagName = function (data) {
        return !data.chat_id ? 'img':'div';
    };
    avatar.innerHTML = function (data) {
        if (data.chat_id) {
            return [
                {tagName: 'i', className: 'icon-user'},
                data.profiles.length
            ];
        }
    };

    tpl.className = ['t-item t-item--chat ', function (data) {
        if (!data.chat_id) {
            return data.profiles.at(0).get('online') ? 'is-online':undefined;
        }
    }];
    // TODO
    // tpl.className.push(function (data) {
        // if (data.item.read_state === 0) {
            // return ' unread';
        // }
    // });
    // tpl.attributes['data-mid'] = function (data) {
        // return data.item.mid;
    // };
    tpl.attributes['data-chat-id'] = function (data) {
        return data.chat_id;
    };
    tpl.attributes['data-owner-id'] = function (data) {
        return data.uid;
    };
    jtoh(tpl).getElementsByClassName('t-item__author')[0].innerHTML = function (data) {
        var profiles = data.profiles;

        if (!data.chat_id) {
            profiles = [profiles.get(data.uid).toJSON()];
        } else {
            profiles = data.profiles.toJSON();
        }
        return profiles.map(function (profile) {
            return [profile.first_name, profile.last_name].join(' ');
        }).join(', ');
    };
    content.tagName = 'blockquote';
    content.innerHTML = [
        {
            tagName: 'p',
            innerHTML: function (data) {
                return data.messages.map(function (message, i) {
                    var content = [message.body, jtoh(attachmentsTemplate).build({
                        item: message
                    })];
                    if (i < data.messages.length - 1) {
                        content.push('</br>');
                    }
                    return content;
                });
            }
        },
        function (data) {
            var senderUid = data.messages[0].uid,
                senderProfile;

            if ((data.chat_id || data.uid !== senderUid)) {
                senderProfile = data.profiles.get(senderUid);

                return {tagName: 'small', innerHTML: [
                    senderProfile.get('first_name'), senderProfile.get('last_name')
                ].join(' ')};
            }
        }
    ];
    content.className.push(function (data) {
        if (data.messages[0].uid !== data.uid) {
            return ' pull-right';
        }
    });
    jtoh(tpl).getElementsByClassName('t-item__actions')[0].innerHTML = [
        {tagName: 'a', className: 't-item__action t-item__action--message', attributes: {href: '#'}, innerHTML: [
            {tagName: 'i', className: 'icon-envelope'}
        ]},
        // function (data) {
            // if (data.profiles.length === 1 && data.profiles[0].hasOwnProperty('online')) {
                // return [' ', {tagName: 'a', className: 'action action-favourite', attributes: {href: '#'}, innerHTML: [
                    // {tagName: 'i', className: 'icon-star'}
                // ]}];
            // }
        // }
    ];
    return tpl;
});
