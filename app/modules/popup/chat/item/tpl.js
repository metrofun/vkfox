define([
    'jtoh',
    'jquery',
    'item/tpl',
    'item/attachments',
    'chat/i18n'
], function (jtoh, jQuery, itemTemplate, attachmentsTemplate, i18n) {
    var tpl = jQuery.extend(true, {}, itemTemplate),
        avatar = jtoh(tpl).getElementsByClassName('t-item__img')[0],
        content = jtoh(tpl).getElementsByClassName('t-item__content')[0];

    avatar.attributes.src = function (data) {
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

    tpl.className.push([' t-chat__item ', function (data) {
        if (!data.chat_id) {
            return data.profiles.at(0).get('online') ? 'is-online':undefined;
        }
    }]);
    tpl.attributes['data-chat-id'] = function (data) {
        return data.chat_id;
    };
    tpl.attributes['data-uid'] = function (data) {
        return data.uid;
    };
    jtoh(tpl).getElementsByClassName('t-item__author')[0].innerHTML = function (data) {
        var profiles;

        if (!data.chat_id) {
            profiles = [data.profiles.get(data.uid).toJSON()];
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
    jtoh(tpl).getElementsByClassName('t-item__actions')[0].innerHTML = (function () {
        var elements = [
            {name: 'toggle-message', icon: 'icon-envelope', title: i18n('private-message')}
        ];

        return elements.map(function (element) {
            return {
                tagName: 'i',
                attributes: {
                    title: element.title,
                    class: 't-item__action t-chat__' + element.name + ' ' + element.icon
                }
            };
        });
    }());
    return tpl;
});
