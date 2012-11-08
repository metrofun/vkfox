define(['jtoh'], function (jtoh) {
    return [
        {className: 'navbar navbar-inverse navbar-static-top', innerHTML: {
            className: 'navbar-inner',
            innerHTML: {className: 'container', innerHTML: [
                // {className: 'brand', tagName: 'a', attributes: {href: '#'}, innerHTML: 'VKfox'},
                {className: 'nav', tagName: 'ul', innerHTML: [
                    {tagName: 'li', innerHTML: {
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
                    {className: 'active', tagName: 'li', innerHTML: {
                        tagName: 'a',
                        attributes: {href: '#friends'},
                        innerHTML: 'Friends'
                    }}
                ]},
            ]}
        }},
        {
            className: 'tab-content content',
            innerHTML: [
                {className: 'tab-pane items', id: 'chat'},
                {className: 'tab-pane items', id: 'feedback'},
                {className: 'tab-pane items', id: 'news'},
                {className: 'tab-pane items active', id: 'friends'}
            ]
        }
    ];
});
