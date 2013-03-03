define(['jtoh', 'app/i18n'], function (jtoh, i18n) {
    return [
        {className: 'navbar navbar-inverse navbar-static-top', innerHTML: {
            className: 'navbar-inner',
            innerHTML: {className: 'container', innerHTML: [
                // {className: 'brand', tagName: 'a', attributes: {href: '#'}, innerHTML: 'VKfox'},
                {className: 'nav', tagName: 'ul', innerHTML: [
                    {tagName: 'li', innerHTML: {
                        tagName: 'a',
                        attributes: {href: '#t-app__chat-pane'},
                        innerHTML: i18n('chat')
                    }},
                    {className: 'active', tagName: 'li', innerHTML: {
                        tagName: 'a',
                        attributes: {href: '#t-app__updates-pane'},
                        innerHTML: i18n('updates')
                    }},
                    {tagName: 'li', innerHTML: {
                        tagName: 'a',
                        attributes: {href: '#t-app__buddies-pane'},
                        innerHTML: i18n('buddies')
                    }}
                ]}
            ]}
        }},
        {
            className: 'tab-content t-app__content',
            innerHTML: [
                {className: 'tab-pane t-item-list', id: 't-app__chat-pane'},
                {className: 'tab-pane active', id: 't-app__updates-pane'},
                {className: 'tab-pane', id: 't-app__buddies-pane'}
            ]
        }
    ];
});
