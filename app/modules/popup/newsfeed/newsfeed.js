define(['backbone', 'mediator/mediator', 'newsfeed/item-view'],
    function (Backbone, Mediator, ItemView) {
        var
        NewsfeedView = Backbone.View.extend({
            el: document.body,
            initialize: function () {
                Mediator.pub('newsfeed:view');
                Mediator.sub('newsfeed:data', function (data) {
                    data.items.forEach(function (item) {
                        var itemView = new ItemView({
                            el: this.el,
                            model: new Backbone.Model(item)
                        });
                    }, this);
                }.bind(this));
            }
        }),

        newsfeedView = new NewsfeedView();
    }
);
