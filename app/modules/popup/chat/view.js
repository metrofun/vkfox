define([
    'underscore',
    'backbone',
    'jtoh',
    'mediator/mediator',
    'item/view',
    'item/dialog.tpl'
], function (
    _,
    Backbone,
    jtoh,
    Mediator,
    ItemView,
    template
) {
    return Backbone.View.extend({
        DialogView: ItemView.extend({
            template: jtoh(template).compile()
        }),
        model: new Backbone.Model({
            profiles: new (Backbone.Collection.extend({
                model: Backbone.Model.extend({
                    idAttribute: 'uid'
                })
            }))(),
            items : new Backbone.Collection()
        }),
        initialize: function () {
            this.model.get('items').on('reset', this.render.bind(this));

            Mediator.pub('chat:view');
            Mediator.sub('chat:data', function (data) {
                this.model.get('profiles').reset(data.profiles);
                this.model.get('items').reset(data.items);
            }.bind(this));
        },
        render: function () {
            this.model.get('items').slice(1).forEach(function (item) {
                var
                chatActive = item.get('chat_active'),
                profiles = (chatActive ? chatActive.split(','):[item.get('uid')]).map(function (uid) {
                    return this.model.get('profiles').get(parseInt(uid, 10)).toJSON();
                }, this),
                itemView = new this.DialogView({
                    el: this.el,
                    model: new Backbone.Model({
                        profile: profiles[0],
                        profiles: profiles,
                        item: item.toJSON()
                    })
                });

            }.bind(this));
        }
    });
});
