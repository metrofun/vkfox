define([
    'backbone',
    'jtoh',
    'mediator/mediator',
    'item/view',
    'item/post.view',
    'item/note.tpl',
    'item/friend.tpl',
    'item/new-photo.tpl',
    'item/photo-tag.tpl'
], function (
    Backbone,
    jtoh,
    Mediator,
    ItemView,
    ItemPostView,
    noteTemplate,
    friendTemplate,
    newPhotoTemplate,
    photoTagTemplate
) {
    var compiledTemplates = {
        note: jtoh(noteTemplate).compile(),
        friend: jtoh(friendTemplate).compile(),
        photo: jtoh(newPhotoTemplate).compile(),
        wall_photo: jtoh(newPhotoTemplate).compile(),
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

            Mediator.pub('newsfeed:view');
            Mediator.sub('newsfeed:data', function (data) {
                this.model.get('profiles').reset(data.profiles);
                this.model.get('groups').reset(data.groups);
                this.model.get('items').reset(data.items);
            }.bind(this));
        },
        render: function () {
            this.model.get('items').forEach(function (item) {
                var source_id = item.get('source_id'),
                    itemView, type = item.get('type'), View,
                    profile, group;
                // TODO for source_id < 0
                if (source_id > 0) {
                    profile = this.model.get('profiles').get(source_id).toJSON();
                } else {
                    group = this.model.get('groups').get(-source_id).toJSON();
                }
                switch (type) {
                case 'post':
                    itemView = new ItemPostView({
                        el: this.el,
                        model: new Backbone.Model({
                            profile: profile,
                            group: group,
                            item: item.toJSON()
                        })
                    });
                    break;
                case 'friend':
                    View = ItemView.extend({
                        template: compiledTemplates[type]
                    });
                    itemView = new View({
                        el: this.el,
                        model: new Backbone.Model({
                            profile: profile,
                            count: item.get('friends')[0],
                            profiles: item.get('friends').slice(1).map(function (friend) {
                                return this.model.get('profiles').get(friend.uid);
                            }, this)
                        })
                    });
                    break;
                default:
                    // TODO handle unknown type
                    View = ItemView.extend({
                        template: compiledTemplates[type]
                    });
                    itemView = new View({
                        el: this.el,
                        model: new Backbone.Model({
                            group: group,
                            profile: profile,
                            item: item.toJSON()
                        })
                    });
                    break;
                }
            }, this);
        }
    });
});
