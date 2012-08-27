define(['backbone', 'underscore', 'request/request', 'mediator/mediator'],
    function (Backbone, _, request, Mediator) {
        var
        MAX_ITEMS_COUNT = 50,

        NewsfeedModel = Backbone.Model.extend({
            defaults: {
                startTime: 'API.getServerTime() - 1 * 24 * 60 * 60',
                groups: new Backbone.Collection(),
                profiles: new Backbone.Collection(),
                items : new Backbone.Collection()
            },
            initialize: function () {
                Mediator.sub('auth:success', function () {
                    request.api({
                        code: ['return { "news" : API.newsfeed.get({start_time: ',
                            this.get('startTime'), ', "count" : "', MAX_ITEMS_COUNT,
                            '"}), "time" : API.getServerTime()};'].join('')
                    }).done(function (response) {
                        this.set('startTime',  response.time);
                        console.log(new Backbone.Collection.extend({model: Backbone.Model.extend({})}));
                        this.get('groups').add(response.news.groups);
                        this.get('profiles').add(response.news.groups);
                        this.get('items').add(response.news.items);
                    }.bind(this));
                }.bind(this));
            }
        }),

        newsfeedModel = new NewsfeedModel();
    }
);
