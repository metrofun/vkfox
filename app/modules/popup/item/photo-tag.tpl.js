define(['jtoh', 'jquery', 'item/tpl', 'common/common'], function (jtoh, jQuery, itemTemplate, common) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    jtoh(tpl).getElementsByClassName('item-content')[0].innerHTML = function (data) {
        return [
            'Отметок на фотографиях: ', data.item.photo_tags[0],
            {innerHTML: data.item.photo_tags.slice(1).map(function (photo) {
                return { tagName: 'img', className: 'img-polaroid', attributes: {src: common.addVkBase(photo.src_big)}};
            })}
        ];
    };
    return tpl;
});
