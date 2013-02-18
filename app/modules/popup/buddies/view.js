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
            'click .t-buddies__dropdown-checkbox': function (e) {
                var target = e.target;

                this.model.get('filters').set(target.name, target.checked);
                this.model.get('itemsViews').reset();

                this.$el.find('.t-buddies__item-list').empty();
                Mediator.pub('buddies:data:get');
            },
            'click .t-buddies__toggle-favourite': function (e) {
                var item = jQuery(e.target).parents('.t-buddies__item');

                item.toggleClass('is-favourite');
                Mediator.pub('buddies:favourite:toggle', item.data('uid'));
            },
            'keypress .t-buddies__add-fav-button': function (e) {
                var value, screenName;
                if (e.keyCode === 13) {
                    value = e.currentTarget.value;
                    e.currentTarget.value = '';
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
        renderBuddies: function (buddies) {
            var self = this,
                fragment = document.createDocumentFragment();

            buddies.filter(this.filterBuddy, this).forEach(function (buddie) {
                var view = self.model.get('itemsViews').get(buddie.id);

                if (view) {
                    view.get('view').model.set(buddie);
                    view.get('view').$el.appendTo(fragment);
                } else {
                    self.model.get('itemsViews').add({
                        id: buddie.id,
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
