define(['jtoh'], function (jtoh) {
    return [
        {className: 'navbar navbar-static-top', innerHTML: {className: 'navbar-inner', innerHTML: {
            tagName: 'form',
            className: 'navbar-form',
            innerHTML: [
                {tagName: 'input', attributes: {
                    type: 'text',
                    placeholder: 'Search...',
                    class: 'search-form span2 t-buddies__add-fav-button'
                }},
                // {
                    // className: 'btn-group pull-right',
                    // attributes: {'data-toggle': 'buttons-checkbox'},
                    // innerHTML: [
                        // {
                            // tagName: 'button',
                            // className: 'btn dropdown-toggle',
                            // attributes: {'data-toggle': 'dropdown', type: 'button'},
                            // innerHTML: [
                                // {tagName: 'i', className: 'icon-align-justify'}, ' ',
                                // {className: 'caret'}
                            // ]
                        // },
                        // {
                            // tagName: 'ul',
                            // className: 'dropdown-menu',
                            // innerHTML: [
                                // {tagName: 'li', innerHTML: {
                                    // tagName: 'label',
                                    // className: 'checkbox',
                                    // innerHTML: 'zzz'
                                // }}
                            // ]
                        // }
                    // ]
                // }
            ]
        }}},
        {className: 'items'}
    ];
});
