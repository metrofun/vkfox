define([
    'backbone',
    'jtoh',
    'mediator/mediator',
    'item/view',
    'item/post.view',
    'item/note.tpl',
    'item/friend.tpl',
    'item/photo.tpl',
    'item/photo-tag.tpl',
    'item/comment.tpl',
    'item/like.tpl'
], function (
    Backbone,
    jtoh,
    Mediator,
    ItemView,
    ItemPostView,
    noteTemplate,
    friendTemplate,
    photoTemplate,
    photoTagTemplate,
    commentTemplate,
    likeTemplate
) {
    var compiledTemplates = {
        note: jtoh(noteTemplate).compile(),
        friend: jtoh(friendTemplate).compile(),
        photo: jtoh(photoTemplate).compile(),
        photo_tag: jtoh(photoTagTemplate).compile()
    };

    return Backbone.View.extend({
        model: new Backbone.Model({
            groups: new (Backbone.Collection.extend({
                model: Backbone.Model.extend({
                    idAttribute: 'gid'
                })
            }))(),
            profiles: new (Backbone.Collection.extend({
                model: Backbone.Model.extend({
                    idAttribute: 'uid'
                })
            }))(),
            items : new Backbone.Collection()
        }),
        initialize: function () {
            this.model.get('items').on('reset', this.render.bind(this));

            Mediator.pub('feedback:view');
            Mediator.sub('feedback:data', function (data) {
                this.model.get('profiles').reset(data.profiles);
                this.model.get('groups').reset(data.groups);
                this.model.get('items').reset(data.items);
            }.bind(this));
        },
        render: function () {
            this.model.get('items').slice(1).forEach(function (item) {
                var itemView, type = item.get('type'), View, parent, $parent,
                    feedback = item.get('feedback');

                if (['comment_post', 'like_post'].indexOf(type) !== -1) {
                    parent = item.get('parent');

                    $parent = this.$el.find([
                        '.item[data-uid=',
                        parent.from_id,
                        '][data-pid=',
                        parent.id,
                        ']'
                    ].join(''));

                    if (!$parent.length) {
                        itemView = new ItemPostView({
                            el: this.el,
                            model: new Backbone.Model({
                                profile: this.model.get('profiles').get(parent.from_id).toJSON(),
                                item: parent
                            })
                        });
                        $parent = itemView.$el;
                    }
                }

                switch (type) {
                case 'wall':
                    itemView = new ItemPostView({
                        el: this.el,
                        model: new Backbone.Model({
                            profile: this.model.get('profiles').get(feedback.owner_id).toJSON(),
                            item: feedback
                        })
                    });
                    break;
                case 'comment_post':
                    View = ItemView.extend({
                        template: jtoh(commentTemplate).compile()
                    });
                    itemView = new View({
                        el: $parent,
                        model: new Backbone.Model({
                            profile: this.model.get('profiles').get(feedback.owner_id).toJSON(),
                            item: feedback
                        })
                    });
                    break;
                case 'like_post':
                    View = ItemView.extend({
                        template: jtoh(likeTemplate).compile()
                    });
                    feedback.forEach(function (user) {
                        itemView = new View({
                            el: $parent,
                            model: new Backbone.Model({
                                profile: this.model.get('profiles').get(user.owner_id).toJSON(),
                            })
                        });
                    }, this);
                    break;
                case 'like_comment':
                    parent = item.get('parent');
                    itemView = new ItemPostView({
                        el: this.el,
                        model: new Backbone.Model({
                            profile: this.model.get('profiles').get(parent.owner_id).toJSON(),
                            item: parent
                        })
                    });
                }
            }, this);
        }
    });
});
