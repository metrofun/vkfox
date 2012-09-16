define(['jtoh'], function (jtoh) {
    return jtoh([
        {className: 'navbar navbar-inverse navbar-static-top', innerHTML: {
            className: 'navbar-inner',
            innerHTML: {className: 'container', innerHTML: [
                {className: 'brand', tagName: 'a', attributes: {href: '#'}, innerHTML: 'VKfox'},
                {className: 'nav', tagName: 'ul', innerHTML: [
                    {className: 'active', tagName: 'li', attributes: {href: '#'}, innerHTML: {
                        tagName: 'a',
                        attributes: {href: '#'},
                        innerHTML: 'Updates'
                    }},
                    {tagName: 'li', attributes: {href: '#'}, innerHTML: {
                        tagName: 'a',
                        attributes: {href: '#'},
                        innerHTML: 'News'
                    }},
                    {tagName: 'li', attributes: {href: '#'}, innerHTML: {
                        tagName: 'a',
                        attributes: {href: '#'},
                        innerHTML: 'Chat'
                    }}
                ]},
            ]}
        }},
        {className: 'content', innerHTML: {className: 'items'}}
    ]).compile();
});
