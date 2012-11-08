define(['jtoh'], function (jtoh) {
    return [
        {className: 'navbar', innerHTML: {className: 'navbar-inner', innerHTML: {
            tagName: 'form',
            className: 'navbar-form pull-left',
            innerHTML: {tagName: 'input', attributes: {
                type: 'text',
                placeholder: 'Search...',
                class: 'search-query typeahead'
            }}
        }}}
    ];
});
