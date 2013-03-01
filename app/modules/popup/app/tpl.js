define(['jtoh'], function (jtoh) {
    return [
        {className: 'navbar navbar-inverse navbar-static-top', innerHTML: {
            className: 'navbar-inner',
            innerHTML: {className: 'container', innerHTML: [
                // {className: 'brand', tagName: 'a', attributes: {href: '#'}, innerHTML: 'VKfox'},
                {className: 'nav', tagName: 'ul', innerHTML: [
                    {className: 'active', tagName: 'li', innerHTML: {
                        tagName: 'a',
                        attributes: {href: '#chat'},
                        innerHTML: 'Chat'
                    }},
                    {tagName: 'li', innerHTML: {
                        tagName: 'a',
                        attributes: {href: '#feedback'},
                        innerHTML: 'Feedback'
                    }},
                    {tagName: 'li', innerHTML: {
                        tagName: 'a',
                        attributes: {href: '#news'},
                        innerHTML: 'News'
                    }},
                    {tagName: 'li', innerHTML: {
                        tagName: 'a',
                        attributes: {href: '#buddies'},
                        innerHTML: 'Buddies'
                    }}
                ]}
            ]}
        }},
        {
            className: 'tab-content content',
            innerHTML: [
                {className: 'tab-pane t-item-list active', id: 'chat'},
                {className: 'tab-pane t-item-list', id: 'feedback'},
                {className: 'tab-pane t-item-list', id: 'news'},
                {className: 'tab-pane', id: 'buddies'}
            ]
        }
    ];
});
