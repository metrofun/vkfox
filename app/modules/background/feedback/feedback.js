define(['backbone', 'underscore', 'request/request', 'mediator/mediator'],
    function (Backbone, _, request, Mediator) {
        var
        MAX_ITEMS_COUNT = 50,

        FeedbackModel = Backbone.Model.extend({
            startTime: 'API.getServerTime() - 1 * 24 * 60 * 60',
            defaults: {
                groups: new Backbone.Collection(),
                profiles: new Backbone.Collection(),
                items : new Backbone.Collection()
            },
            initialize: function () {
                Mediator.sub('auth:success', function () {
                    request.api({
                        code: ['return { "news" : API.notifications.get({start_time: ',
                            this.startTime, ', "count" : "', MAX_ITEMS_COUNT,
                            '"}), "time" : API.getServerTime()};'].join('')
                    }).done(function (response) {
                        this.startTime = response.time;

                        this.get('groups').add(response.news.groups);
                        this.get('profiles').add(response.news.profiles);
                        this.get('items').add(response.news.items);
                    }.bind(this));
                }.bind(this));

                Mediator.sub('feedback:view', function () {
                    Mediator.pub('feedback:data', this.toJSON());
                }.bind(this));
            }
        }),

        feedbackModel = new FeedbackModel();
    }
);
