define(['jtoh'], function (jtoh) {
    return {
        className: ['t-item media'],
        innerHTML: [
            {
                className: 'pull-left',
                tagName: 'a',
                innerHTML: {className: 't-item__img media-object', tagName: 'img', attributes: {
                    src: function (data) {
                        return data.profile ? data.profile.photo:data.group.photo;
                    }
                }}
            },
            {className: 'media-body', innerHTML: {
                className: 't-item__author media-heading',
                innerHTML: function (data) {
                    if (data.profile) {
                        return [data.profile.first_name, data.profile.last_name].join(' ');
                    } else {
                        return data.group.name;
                    }
                }
            }}
        ]
    };
    return {
        className: ['item '],
        attributes: {},
        innerHTML: [
            {
                className: 'item-inner',
                innerHTML: [
                    {className: 'avatar', tagName: 'img', attributes: {
                        src: function (data) {
                            console.log(data);
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
                    {className: ['item-content']}
                ]
            }
        ]
    };
});
