define(['jtoh'], function (jtoh) {
    return [
        {className: 'navbar navbar-static-top', innerHTML: {
            className: 'navbar-inner form-inline navbar-form t-buddies__controls',
            tagName: 'form',
            innerHTML: [
                {
                    className: 'input-append',
                    innerHTML: [
                        // {className: 'add-on', innerHTML: [
                            // 'Watch'
                            // // {
                                // // tagName: 'i',
                                // // className: 'icon-star'
                                // // }
                        // ]},
                        {tagName: 'input', attributes: {
                            type: 'text',
                            placeholder: 'http://vk.com/durov',
                            class: 'span2 t-buddies__add-fav-button'
                        }},
                        {tagName: 'button', attributes: {
                            class: 'btn',
                            type: 'button'
                            // TODO I18N
                        }, innerHTML: 'Watch'},
                    ]
                },
                // {
                    // tagName: 'label',
                    // className: 'checkbox',
                    // innerHTML: [
                        // {
                            // tagName: 'input',
                            // attributes: {
                                // type: 'checkbox',
                            // }
                        // },
                        // 'Offline'
                    // ]
                // },
                {
                    className: 'btn-group pull-right',
                    attributes: {'data-toggle': 'buttons-checkbox'},
                    innerHTML: [
                        {
                            tagName: 'button',
                            className: 'btn dropdown-toggle',
                            attributes: {'data-toggle': 'dropdown', type: 'button'},
                            innerHTML: [
                                'Filter ',
                                // {tagName: 'i', className: 'icon-align-justify'}, ' ',
                                {className: 'caret'}
                            ]
                        },
                        {
                            tagName: 'ul',
                            className: 'dropdown-menu t-buddies__dropdown',
                            innerHTML: function (data) {
                                return Object.keys(data).map(function (checkboxName) {
                                    return {tagName: 'li', innerHTML: { tagName: 'a', innerHTML: {
                                        tagName: 'label',
                                        className: 'checkbox t-buddies__dropdown-label',
                                        innerHTML: [
                                            {
                                                tagName: 'input',
                                                attributes: {
                                                    name: checkboxName,
                                                    checked: data[checkboxName] ? 'checked':undefined,
                                                    class: 't-buddies__dropdown-checkbox',
                                                    type: 'checkbox',
                                                }
                                            },
                                            //TODO I18N
                                            checkboxName
                                        ]
                                    }}};
                                });
                            }
                        }
                    ]
                }
            ]
        }},
        {className: 't-buddies__item-list'}
    ];
});
