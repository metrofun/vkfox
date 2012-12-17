define(['jtoh', 'jquery', 'item/tpl'], function (jtoh, jQuery, itemTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    tpl.className.push(' item-friend');
    // jtoh(tpl).getElementsByClassName('item-header')[0].innerHTML.push({
        // tagName: 'span',
        // className: 'label label-important',
        // innerHTML: '+3'
    // });
    jtoh(tpl).getElementsByClassName('actions')[0].innerHTML = [
        {tagName: 'a', attributes: {href: '#'}, innerHTML: [
            {tagName: 'i', className: 'icon-envelope'},
            {tagName: 'span', innerHTML: 'Message'}
        ]},
        ' ',
        {tagName: 'a', attributes: {href: '#'}, innerHTML: [
            {tagName: 'i', className: 'icon-star'},
            {tagName: 'span', innerHTML: 'Watch'}
        ]}
    ];
    return tpl;
});
