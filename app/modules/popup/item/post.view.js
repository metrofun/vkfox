define(['backbone', 'jtoh', 'item/view', 'item/post.tpl'], function (Backbone, jtoh, ItemView, postTemplate) {
    return ItemView.extend({
        template: jtoh(postTemplate).compile()
    });
});
