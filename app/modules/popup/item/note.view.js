define(['backbone', 'jtoh', 'item/view', 'item/note.tpl'], function (Backbone, jtoh, ItemView, noteTemplate) {
    return ItemView.extend({
        template: jtoh(noteTemplate).compile(),
    });
});
