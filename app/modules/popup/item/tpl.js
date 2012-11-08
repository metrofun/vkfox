define(['jtoh'], function (jtoh) {
    return {
        className: 'item',
        attributes: {
            'data-owner-id': function (data) {
                return (data.profile && data.profile.uid) || -data.group.gid;
            }
        },
        innerHTML: {
            className: 'item-inner',
            innerHTML: [
                {className: 'item-header', innerHTML: [
                    {className: 'avatar', tagName: 'img', attributes: {
                        src: function (data) {
                            return data.profile ? data.profile.photo:data.group.photo;
                        },
                        alt: ''
                    }},
                    {className: 'name', tagName: 'strong', innerHTML: function (data) {
                        if (data.profile) {
                            return [data.profile.first_name, data.profile.last_name].join(' ');
                        } else {
                            return data.group.name;
                        }
                    }},
                    {className: 'time muted', innerHTML: function () {return 'yyy'; }}
                ]},
                {className: 'item-content', innerHTML: function () {return 'zzzz'; }},
                {className: 'item-foot', innerHTML: {
                    className: 'actions'
                }}
            ]
        }
    };
});
