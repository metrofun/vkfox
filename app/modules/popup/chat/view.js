define([
    'underscore',
    'backbone',
    'jtoh',
    'mediator/mediator',
    'chat/tpl',
    'chat/friend-item.tpl',
    'item/view',
    'chat/recent-item.view',
    'jquery.dropdown'
], function (
    _,
    Backbone,
    jtoh,
    Mediator,
    template,
    friendTemplate,
    ItemView,
    RecentView
) {
    return Backbone.View.extend({
        template: jtoh(template).build(),
        FriendView: ItemView.extend({
            template: jtoh(friendTemplate).compile()
        }),
        model: new Backbone.Model({
            friends: new (Backbone.Collection.extend({
                model: Backbone.Model.extend({
                    idAttribute: 'uid'
                })
            }))(),
            nonFriendsProfiles: new (Backbone.Collection.extend({
                model: Backbone.Model.extend({
                    idAttribute: 'uid'
                })
            }))(),
            dialogsItems : new Backbone.Collection()
        }),
        events: {
            'click .action-favourite': function (e) {
                var item = jQuery(e.target).parents('.item'),
                    uid = item.data('owner-id');

                if (typeof uid !== 'undefined') {
                    RecentView.toggleFavourite(item);
                }
            }
        },
        initialize: function () {
            this.$el.append(this.template);

            // this.model.get('dialogsItems').on('reset', this.render.bind(this));

            Mediator.pub('chat:view');
            Mediator.sub('chat:data', function (data) {
                this.model.get('nonFriendsProfiles').reset(data.nonFriendsProfiles);
                this.model.get('friends').reset(data.friends);
                this.model.get('dialogsItems').reset(data.dialogsItems);

                this.render();
            }.bind(this));
        },
        render: function () {
            this.renderControls();
            this.renderRecentItems();
            // this.renderFriendsItems();
        },
        renderRecentItems: function () {
            var fragment = document.createDocumentFragment();

            this.model.get('dialogsItems').slice(1).forEach(function (item) {
                var
                chatActive = item.get('chat_active'),
                profiles = (chatActive ? chatActive.split(','):[item.get('uid')]).map(function (uid) {
                    var friendProfile  = this.model.get('friends').get(uid),
                        nonFriendProfile = this.model.get('nonFriendsProfiles').get(uid);
                    uid = parseInt(uid, 10);

                    return (friendProfile || nonFriendProfile).toJSON();
                }, this),

                view = new RecentView({
                    el: fragment,
                    model: new Backbone.Model({
                        profiles: profiles,
                        item: item.toJSON()
                    })
                });
            }, this);

            this.$el.find('.items').prepend(fragment);
        },
        renderControls: function () {
            this.$el.find('.dropdown-toggle').dropdown();

            this.$el.find('.typeahead').typeahead({
                source: this.model.get('friends').map(function (friend) {
                    return [friend.get('first_name'), friend.get('last_name')].join(' ');
                })
            });
        },
        renderRecent: function () {
            var fragment = document.createDocumentFragment();

            this.model.get('dialogsItems').slice(1).forEach(function (item) {
                var
                chatActive = item.get('chat_active'),
                profiles = (chatActive ? chatActive.split(','):[item.get('uid')]).map(function (uid) {
                    return this.model.get('profiles').get(parseInt(uid, 10)).toJSON();
                }, this),

                itemView = new this.DialogView({
                    el: fragment,
                    model: new Backbone.Model({
                        profile: profiles[0],
                        profiles: profiles,
                        item: item.toJSON()
                    })
                });

            }.bind(this));

            this.$el.find('.dialogsItems').prepend(fragment);
        },
        renderFriendsItems: function () {
            var ITEMS_PER_TICK = 10, $itemsHolder = this.$el.find('.items');

            // split all friends into chunks
            _(this.model.get('friends').groupBy(function (friend, i) {
                return i % ITEMS_PER_TICK;
            })).forEach(function (collection) {
                // defer rendering of chunks
                _.defer(function () {
                    var fragment = document.createDocumentFragment();

                    collection.forEach(function (friend) {
                        var FriendView = new this.FriendView({
                            el: fragment,
                            model: new Backbone.Model({
                                profile: friend.toJSON()
                            })
                        });
                    }, this);

                    $itemsHolder.append(fragment);
                }.bind(this));
            }.bind(this));
        }
    });
});
