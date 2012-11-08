define([
    'underscore',
    'backbone',
    'jtoh',
    'mediator/mediator',
    'item/view',
    'item/post.view',
    'item/friend.tpl',
    'item/comment.tpl',
    'item/copy.tpl',
    'item/like.tpl',
    'item/photo.tpl',
    'item/topic.tpl',
    'item/follow.tpl',
    'item/video.tpl'
], function (
    _,
    Backbone,
    jtoh,
    Mediator,
    ItemView,
    ItemPostView,
    friendTemplate,
    commentTemplate,
    copyTemplate,
    likeTemplate,
    photoTemplate,
    topicTemplate,
    followTemplate,
    videoTemplate
) {
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
        // TODO user documentfragment
        render: function () {
            this.model.get('items').slice(1).reverse().forEach(function (item) {
                var itemView, type = item.get('type'), View,
                    parent = item.get('parent'), $parent,
                    feedback = item.get('feedback');

                if (['comment_post', 'like_post', 'copy_post'].indexOf(type) !== -1) {
                    $parent = this.$el.find([
                        '.item[data-owner-id=',
                        parent.from_id,
                        '][data-pid=',
                        parent.id,
                        ']'
                    ].join(''));

                    if (!$parent.length) {
                        $parent = this.renderPost({parent: this.el, item: parent}).$el;
                    }

                    switch (type) {
                    case 'comment_post':
                        this.renderComment({parent: $parent, item: feedback});
                        break;
                    case 'like_post':
                        this.renderLikes({parent: $parent, item: feedback});
                        break;
                    case 'copy_post':
                        this.renderCopies({parent: $parent, item: feedback});
                        break;
                    }
                } else if (['reply_comment', 'like_comment'].indexOf(type) !== -1) {
                    $parent = this.$el.find([
                        '.item[data-owner-id=',
                        parent.owner_id,
                        '][data-cid=',
                        parent.id,
                        ']'
                    ].join(''));

                    if (!$parent.length) {
                        $parent = this.renderComment({parent: this.el, item: parent}).$el;
                    }

                    switch (type) {
                    case 'like_comment':
                        this.renderLikes({parent: $parent, item: feedback});
                        break;
                    case 'reply_comment':
                        this.renderComment({parent: $parent, item: feedback});
                        break;
                    }
                } else if (['comment_video', 'like_video', 'copy_video'].indexOf(type) !== -1) {
                    $parent = this.$el.find([
                        '.item[data-owner-id=',
                        parent.owner_id,
                        '][data-vid=',
                        parent.id,
                        ']'
                    ].join(''));

                    if (!$parent.length) {
                        $parent = this.renderItem({
                            parent: this.el,
                            item: parent,
                            template: jtoh(videoTemplate).compile()
                        }).$el;
                    }

                    switch (type) {
                    case 'comment_video':
                        this.renderComment({parent: $parent, item: feedback});
                        break;
                    case 'like_video':
                        this.renderLikes({parent: $parent, item: feedback});
                        break;
                    case 'copy_video':
                        this.renderCopies({parent: $parent, item: feedback});
                        break;
                    }
                } else if (['comment_photo', 'like_photo', 'copy_photo'].indexOf(type) !== -1) {
                    $parent = this.$el.find([
                        '.item[data-owner-id=',
                        parent.owner_id,
                        '][data-photo-id=',
                        parent.pid,
                        ']'
                    ].join(''));

                    if (!$parent.length) {
                        $parent = this.renderItem({
                            parent: this.el,
                            item: parent,
                            template: jtoh(photoTemplate).compile()
                        }).$el;
                    }

                    switch (type) {
                    case 'comment_photo':
                        this.renderComment({parent: $parent, item: feedback});
                        break;
                    case 'like_photo':
                        this.renderLikes({parent: $parent, item: feedback});
                        break;
                    case 'copy_photo':
                        this.renderCopies({parent: $parent, item: feedback});
                        break;
                    }

                } else if (type === 'reply_topic') {
                    $parent = this.$el.find([
                        '.item[data-owner-id=',
                        parent.owner_id,
                        '][data-tid=',
                        parent.id,
                        ']'
                    ].join(''));

                    if (!$parent.length) {
                        $parent = this.renderItem({
                            parent: this.el,
                            item: parent,
                            template: jtoh(topicTemplate).compile()
                        }).$el;

                    }
                    this.renderComment({parent: $parent, item: feedback});

                } else {
                    switch (type) {
                    case 'wall':
                        this.renderPost({parent: this.el, item: feedback});
                        break;
                    case 'mention':
                        this.renderPost({parent: this.el, item: feedback});
                        break;
                    case 'follow':
                        // TODO make profiles field for followers
                        return;
                        new (ItemView.extend({
                            // TODO cache compiled
                            template: jtoh(followTemplate).compile()
                        }))({
                            el: this.el,
                            model: new Backbone.Model({
                                profile: this.model.get('profiles').get(ownerId).toJSON(),
                                profiles: [].concat(feedback).map(function (follower) {
                                    return follower.owner_id;
                                }, this)
                            })
                        })
                        break;
                    }
                }
            }, this);
        },
        renderPost: function (data) {
            var profile, group, ownerId = data.item.owner_id || data.item.from_id;

            if (ownerId > 0) {
                profile = this.model.get('profiles').get(ownerId).toJSON();
            } else {
                group = this.model.get('groups').get(- ownerId).toJSON();
            }

            return new ItemPostView({
                el: data.parent,
                model: new Backbone.Model({
                    item: data.item,
                    profile: profile,
                    group: group
                })
            });
        },
        renderItem: function (data) {
            var
            View = ItemView.extend({
                // TODO cache compiled
                template: data.template
            }), view;

            ([].concat(data.item)).forEach(function (item) {
                var profile, group;
                if (item.owner_id > 0) {
                    profile = this.model.get('profiles').get(item.owner_id).toJSON();
                } else {
                    group = this.model.get('groups').get(-item.owner_id).toJSON();
                }

                view = new View({
                    el: data.parent,
                    model: new Backbone.Model({
                        item: item,
                        profile: profile,
                        group: group
                    })
                });
            }, this);
            return view;
        },
        renderComment: function (data) {
            return this.renderItem(_.extend(data, {
                template: jtoh(commentTemplate).compile()
            }));
        },
        renderLikes: function (data) {
            return this.renderItem(_.extend(data, {
                template: jtoh(likeTemplate).compile()
            }));
        },
        renderCopies: function (data) {
            return this.renderItem(_.extend(data, {
                template: jtoh(copyTemplate).compile()
            }));
        }
    });
});
