define(['backbone', 'underscore', 'request/request', 'mediator/mediator'],
    function (Backbone, _, request, Mediator) {
        var
        MAX_ITEMS_COUNT = 50,
        UPDATE_ONLINE_INTERVAL = 30000;

        return Backbone.Model.extend({
            startTime: 'API.getServerTime() - 1 * 24 * 60 * 60',
            defaults: {
                groups: new Backbone.Collection(),
                profiles: new (Backbone.Collection.extend({
                    model: Backbone.Model.extend({
                        idAttribute: 'uid'
                    })
                }))(),
                items : new Backbone.Collection()
            },
            updateOnlineStatus: _.debounce(function () {
                var uids = _.filter(this.get('items').pluck('source_id'), function (sourceId) {
                    return sourceId > 0;
                }), self = this;

                Mediator.pub('users:get', uids);
                Mediator.sub('users:' + uids.join(), function handler(data) {
                    Mediator.unsub('users:' + uids.join(), handler);

                    self.get('profiles').add(data);
                    self.updateOnlineStatus();
                });
            }, UPDATE_ONLINE_INTERVAL),
            initialize: function () {
                request.api({
                    code: ['return { "news" : API.newsfeed.get({start_time: ',
                        this.startTime, ', "count" : "', MAX_ITEMS_COUNT,
                        '"}), "time" : API.getServerTime()};'].join('')
                }).done(function (response) {
                    this.startTime = response.time;

                    this.get('groups').add(response.news.groups);
                    this.get('profiles').add(response.news.profiles);
                    this.get('items').add(response.news.items);
                }.bind(this));

                Mediator.sub('newsfeed:view', function () {
                    Mediator.pub('newsfeed:data', this.toJSON());
                }.bind(this));

                this.updateOnlineStatus();
            }
        });
    }
);
