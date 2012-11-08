define(['jtoh', 'jquery', 'item/tpl', 'item/attachments'], function (jtoh, jQuery, itemTemplate, attachmentsTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate),
        avatar = jtoh(tpl).getElementsByClassName('avatar')[0];

    tpl.attributes['data-mid'] = function (data) {
    };
    tpl.attributes['data-chat-id'] = function (data) {
        return data.item.chat_id;
    };
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

    jtoh(tpl).getElementsByClassName('name')[0].innerHTML = function (data) {
        return data.profiles.map(function (profile) {
            return [profile.first_name, profile.last_name].join(' ');
        }).join(', ');
    };
    jtoh(tpl).getElementsByClassName('item-content')[0].innerHTML = [
        function (data) {
            return [
                data.item.out ? [{
                    tagName: 'i',
                    className: data.item.read_state ? 'icon-check':'icon-share'
                }, '&nbsp']:undefined,
                data.item.body
            ];
        },
        attachmentsTemplate
    ];
    return tpl;
});
