define([
    'jtoh',
    'jquery',
    'item/tpl',
    'item/attachments'
], function (jtoh, jQuery, itemTemplate, attachmentsTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate),
        avatar = jtoh(tpl).getElementsByClassName('avatar')[0],
        content = jtoh(tpl).getElementsByClassName('item-content')[0];

    avatar.attributes.src = function (data) {
        var companionProfile;
        if (!data.chat_id) {
            data.profiles.some(function (profile) {
                if (profile.uid === data.uid) {
                    companionProfile = profile;
                    return true;
                }
            });
            return companionProfile.photo;
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

    tpl.className[1] = function (data) {
        if (data.profiles.length ===  1) {
            return data.profiles[0].online ? 'online':undefined;
        }
    };
    tpl.className.push(' item-recent');
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
    jtoh(tpl).getElementsByClassName('name')[0].innerHTML = function (data) {
        var profiles = data.profiles;

        if (!data.chat_id) {
            profiles.some(function (profile) {
                if (profile.uid === data.uid) {
                    profiles = [profile];
                    return true;
                }
            });
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

            data.profiles.some(function (profile) {
                console.log(profile.uid, senderUid);
                if (profile.uid === senderUid) {
                    senderProfile = profile;
                    return true;
                }
            });

            if ((data.chat_id || data.uid !== senderUid) && senderProfile) {
                return {tagName: 'small', innerHTML: [
                    senderProfile.first_name, senderProfile.last_name
                ].join(' ')};
            }
        }
    ];
    content.className.push(function (data) {
        if (data.messages[0].uid !== data.uid) {
            return ' pull-right';
        }
    });
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
