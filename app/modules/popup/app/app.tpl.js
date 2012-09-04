define(['jtoh'], function (jtoh) {
    return jtoh.compile([
        {className: 'navbar navbar-inverse navbar-static-top', innerHTML: {
            className: 'navbar-inner',
            innerHTML: [
                {tagName: 'a', className: 'brand', attributes: {href: '#'}, innerHTML: 'VKfox'},
                {tagName: 'ul', className: 'nav', innerHTML: [
                    {tagName: 'li', className: 'active', attributes: {href: '#'}, innerHTML: {
                        tagName: 'a',
                        attributes: {href: '#'},
                        innerHTML: 'Updates'
                    }},
                    {tagName: 'li', className: 'active', attributes: {href: '#'}, innerHTML: {
                        tagName: 'a',
                        attributes: {href: '#'},
                        innerHTML: 'News'
                    }},
                    {tagName: 'li', className: 'active', attributes: {href: '#'}, innerHTML: {
                        tagName: 'a',
                        attributes: {href: '#'},
                        innerHTML: 'Chat'
                    }}
                ]},
            ]
        }},
        {className: 'content', innerHTML: {className: 'items'}}
    ]);
});
