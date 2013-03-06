define(['jtoh'], function (jtoh) {
    return {
        className: ['t-item media'],
        attributes: {},
        innerHTML: [
            {
                className: 'pull-left',
                innerHTML: {className: 't-item__img media-object', tagName: 'img', attributes: {}}
            },
            {className: 'media-body', innerHTML: [
                {
                    className: 't-item__author media-heading',
                    tagName: 'strong',
                    innerHTML: function (data) {
                        if (data.profile) {
                            return [data.profile.first_name, data.profile.last_name].join(' ');
                        } else {
                            return data.group.name;
                        }
                    }
                },
                {className: ['t-item__actions']},
                {className: ['t-item__content']}
            ]}
        ]
    };
});
