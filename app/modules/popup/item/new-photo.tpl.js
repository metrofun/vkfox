define(['jtoh', 'jquery', 'item/tpl', 'common/common'], function (jtoh, jQuery, itemTemplate, common) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    jtoh(tpl).getElementsByClassName('item-content')[0].innerHTML = function (data) {
        return [
            // TODO locale
            'Новых фотографий: ', data.item.photos[0],
            {innerHTML: data.item.photos.slice(1).map(function (photo) {
                return { tagName: 'img', className: 'img-polaroid', attributes: {src: common.addVkBase(photo.src_big)}};
            })}
        ];
    };
    return tpl;
});
