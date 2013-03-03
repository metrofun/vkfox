define(['jtoh', 'updates/i18n'], function (jtoh, i18n) {
    var tabs = ['feedback', 'friends', 'groups'];
    return [
        {className: 'navbar navbar-static-top', innerHTML: {
            className: 'navbar-inner form-inline navbar-form t-updates__controls',
            tagName: 'form',
            innerHTML: {
                attributes: {
                    class: 'btn-group',
                    'data-toggle': 'buttons-radio'
                },
                innerHTML: tabs.map(function (name) {
                    return {tagName: 'a', attributes: {
                        'data-toggle': 'tab',
                        href: '#t-updates__' + name,
                        type: 'button',
                        class: ['btn', function (tabName, data) {
                            if (data.activeTab === tabName) {
                                return ' active';
                            }
                        }.bind(this, name)],
                    }, innerHTML: i18n(name)};
                })
            }
        }},
        {
            className: 'tab-content',
            innerHTML: tabs.map(function (name) {
                return {
                    attributes: {
                        class: ['tab-pane t-item-list', function (tabName, data) {
                            if (data.activeTab === tabName) {
                                return ' active';
                            }
                        }.bind(this, name)],
                        id: 't-updates__' + name
                    }
                };
            })
        }
    ];
});
