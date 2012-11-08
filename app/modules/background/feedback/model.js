define(['backbone', 'underscore', 'request/request', 'mediator/mediator', 'feedback/data'],
    function (Backbone, _, request, Mediator, data) {
        var
        MAX_ITEMS_COUNT = 50;

        return Backbone.Model.extend({
            startTime: 'API.getServerTime() - 1 * 24 * 60 * 60',
            defaults: {
                groups: new Backbone.Collection(),
                profiles: new Backbone.Collection(),
                items : new Backbone.Collection()
            },
            initialize: function () {

                // FIXME remove after dev
                this.get('groups').add(data.news.groups);
                this.get('profiles').add(data.news.profiles);
                this.get('items').add(data.news.items);

                request.api({
                    code: ['return { "news" : API.notifications.get({start_time: ',
                        this.startTime, ', "count" : "', MAX_ITEMS_COUNT,
                        '"}), "time" : API.getServerTime()};'].join('')
                }).done(function (response) {
                    this.startTime = response.time;

                    // TODO uniquiness
                    this.get('groups').add(response.news.groups);
                    this.get('profiles').add(response.news.profiles);
                    this.get('items').add(response.news.items);

                }.bind(this));

                Mediator.sub('feedback:view', function () {
                    Mediator.pub('feedback:data', this.toJSON());
                }.bind(this));
            }
        });
    }
);
