define(['backbone', 'mediator/mediator', 'item/post.view', 'item/note.view'],
    function (Backbone, Mediator, ItemPostView, ItemNoteView) {
        var
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
                    var source_id = item.get('source_id'), itemView;
                    if (source_id > 0) {
                        switch (item.get('type')) {
                        case 'post':
                            break;
                            itemView = new ItemPostView({
                                el: this.el,
                                model: new Backbone.Model({
                                    profile: this.model.get('profiles').get(source_id).toJSON(),
                                    item: item.toJSON()
                                })
                            });
                            break;
                        case 'note':
                            itemView = new ItemNoteView({
                                el: this.el,
                                model: new Backbone.Model({
                                    profile: this.model.get('profiles').get(source_id).toJSON(),
                                    item: item.toJSON()
                                })
                            });
                            console.log(JSON.stringify(item));
                            break;
                        }
                    }
                }, this);
            }
        }),

        newsfeedView = new NewsfeedView();
    }
);
