define([
    'underscore',
    'backbone',
    'jtoh',
    'mediator/mediator',
    'request/request',
    'buddies/tpl',
    'buddies/item/view',
    'storage/model',
    'jquery.dropdown'
], function (
    _,
    Backbone,
    jtoh,
    Mediator,
    request,
    template,
    ItemView,
    StorageModel
) {
    return Backbone.View.extend({
        template: jtoh(template),
        model: new Backbone.Model({
            itemsViews : new Backbone.Collection(),
            filters: new StorageModel({
                offline: true,
                male: true,
                female: true
            }, {name: 'buddies.filters'})
        }),
        events: {
            // prevent form from submiting
            'submit .t-buddies__controls': function (e) {
                return false;
            },
            'click .t-buddies__dropdown-checkbox': function (e) {
                var target = e.target;

                this.model.get('filters').set(target.name, target.checked);
                this.model.get('itemsViews').reset();

                this.$el.find('.t-buddies__item-list').empty();
                Mediator.pub('buddies:data:get');
            },
            'click .t-buddies__add-fav-button': 'addFavouriteBuddie',
            'keypress .t-buddies__add-fav-input': function (e) {
                if (e.keyCode === 13) {
                    this.addFavouriteBuddie();
                }
            }
        },
        initialize: function () {
            this.$el.append(this.template.build(this.model.get('filters').toJSON()));

            Mediator.pub('buddies:data:get');
            Mediator.sub('buddies:data', function (buddies) {
                this.renderBuddies(buddies);
            }.bind(this));
        },
        addFavouriteBuddie: function () {
            var screenName,
                input = this.$el.find('.t-buddies__add-fav-input'),
                value = input.val();

            input.val('');
            try {
                screenName = value.match(/vk\.com\/([\w_]+)/)[1];
            } catch (e) {}

            request.api({
                code: 'return API.resolveScreenName({screen_name: "' + screenName + '"});'
            }).done(function (response) {
                var uid;
                if (response.type === 'user') {
                    uid = response.object_id;
                    Mediator.pub('buddies:favourite:toggle', uid);
                    // } else {
                        // FIXME
                }
            });
        },
        renderBuddies: function (buddies) {
            var self = this,
                fragment = document.createDocumentFragment();

            buddies.filter(this.filterBuddy, this).forEach(function (buddie) {
                var view = self.model.get('itemsViews').get(buddie.uid);

                if (view) {
                    view.get('view').model.set(buddie);
                    view.get('view').$el.appendTo(fragment);
                } else {
                    self.model.get('itemsViews').add({
                        id: buddie.uid,
                        view: new ItemView({
                            el: fragment,
                            model: new Backbone.Model(buddie)
                        })
                    });
                }
            });
            this.$el.find('.t-buddies__item-list').prepend(fragment);
        },
        /**
         * Filters buddie according to selected filters
         *
         * @param {Object} buddie
         * @return {Boolean}
         */
        filterBuddy: function (buddie) {
            var filters = this.model.get('filters');

            return (filters.get('offline') || buddie.online)
                && ((filters.get('male') && buddie.sex === 2)
                || (filters.get('female') && buddie.sex === 1));
        }
    });
});
