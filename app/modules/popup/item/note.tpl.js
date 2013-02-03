define(['jtoh', 'jquery', 'item/tpl'], function (jtoh, jQuery, itemTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    jtoh(tpl).getElementsByClassName('item-content')[0].innerHTML = [
        function (data) {
            return data.item.notes.slice(1).map(function (note) {
                var mid = note.owner_id + '_' + note.nid,
                    url = '/note' + mid;
                return {innerHTML: [
                    {tagName: 'a', attributes: {href: url}, innerHTML: [
                        ' ', {tagName: 'i', className: 'icon-file'}, ' ', note.title
                    ]},
                    note.ncom ? [
                        ' ', {tagName: 'i', className: 'icon-comment'}, ' ', note.ncom
                    ]:undefined
                ]};
            });
        }
    ];
    return tpl;
});
