define([
    'backbone',
    'jtoh',
    'mediator/mediator',
    'item/view',
    'item/post.view',
    'item/note.tpl'
], function (
    Backbone,
    jtoh,
    Mediator,
    ItemView,
    ItemPostView,
    noteTemplate
) {
    var
    compiledTemplates = {
        note: jtoh(noteTemplate).compile(),
        photo: jtoh(noteTemplate).compile(),
        photo_tag: jtoh(noteTemplate).compile()
    },
    NewsfeedView = Backbone.View.extend({
        el: jQuery('.items'),
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
                    itemView, type = item.get('type');
                if (source_id > 0) {
                    switch (type) {
                    case 'post':
                        itemView = new ItemPostView({
                            el: this.el,
                            model: new Backbone.Model({
                                profile: this.model.get('profiles').get(source_id).toJSON(),
                                item: item.toJSON()
                            })
                        });
                        break;
                    // notes photos photo_tags
                    default:
                        itemView = new (ItemView.extend({
                            template: compiledTemplates[type]
                        }))({
                            el: this.el,
                            model: new Backbone.Model({
                                profile: this.model.get('profiles').get(source_id).toJSON(),
                                item: item.toJSON()
                            })
                        });
                        break;
                    }
                }
            }, this);
        }
    }),
    newsfeedView = new NewsfeedView();
});
