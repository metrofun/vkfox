define(['jtoh'], function (jtoh) {
    return {
        className: 'item',
        attributes: {
            'data-uid': function (data) {
                return data.profile.uid;
            }
        },
        innerHTML: {
            className: 'item-inner',
            innerHTML: [
                {className: 'item-header', innerHTML: [
                    {className: 'avatar', tagName: 'img', attributes: {
                        src: function (data) {return data.profile.photo; },
                        alt: ''
                    }},
                    {className: 'name', tagName: 'strong', innerHTML: function (data) {
                        return [data.profile.first_name, data.profile.last_name].join(' ');
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
