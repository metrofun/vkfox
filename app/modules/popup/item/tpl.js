define(['jtoh'], function (jtoh) {
    return {
        className: [
            'item ',
            function (data) {
                return data.profile && data.profile.online ? 'online':undefined;
            }
        ],

        attributes: {
            'data-owner-id': function (data) {
                return (data.profile && data.profile.uid) || (data.group && -data.group.gid);
            }
        },
        innerHTML: [
            {
                className: 'item-inner',
                innerHTML: [
                    {className: 'avatar', tagName: 'img', attributes: {
                        src: function (data) {
                            return data.profile ? data.profile.photo:data.group.photo;
                        },
                        alt: ''
                    }},
                    {className: 'item-header', innerHTML: [
                        {className: 'name', tagName: 'strong', innerHTML: function (data) {
                            if (data.profile) {
                                return [data.profile.first_name, data.profile.last_name].join(' ');
                            } else {
                                return data.group.name;
                            }
                        }},
                        {className: 'actions'}
                        // {className: 'time muted', innerHTML: function () {return 'yyy'; }},
                    ]},
                    {className: 'item-content'}
                ]
            }
        ]
    };
});
