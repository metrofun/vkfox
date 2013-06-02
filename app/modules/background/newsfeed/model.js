define(['backbone', 'underscore', 'request/request', 'mediator/mediator'],
    function (Backbone, _, request, Mediator) {
        var
        MAX_ITEMS_COUNT = 50,
        UPDATE_ONLINE_INTERVAL = 30000;

        return Backbone.Model.extend({
            startTime: '0',
            defaults: {
                profiles: new Backbone.Collection(),
                groupItems: new Backbone.Collection(),
                friendItems: new Backbone.Collection()
            },
            updateOnlineStatus: _.debounce(function () {
                var uids = _.filter(this.get('items').pluck('source_id'), function (sourceId) {
                    return sourceId > 0;
                });

                Mediator.pub('users:get', uids);
                Mediator.once('users:' + uids.join(), function handler(data) {
                    this.get('profiles').add(data);
                    this.updateOnlineStatus();
                }.bind(this));
            }, UPDATE_ONLINE_INTERVAL),
            /**
             * Normalizes response from vk.
             *
             * @params {Object} data
             */
            normalizeResponse: function (data) {
                var news = data.news;

                news.groups.forEach(function (group) {
                    group.id = -group.gid;
                });
                news.profiles.forEach(function (profile) {
                    profile.id = profile.uid;
                });
            },

            initialize: function () {
                request.api({
                    code: ['return { "news" : API.newsfeed.get({start_time: ',
                        this.startTime, ', "count" : "', MAX_ITEMS_COUNT,
                        '"}), "time" : API.getServerTime()};'].join('')
                }).done(function (response) {
                    this.normalizeResponse(response);

                    this.startTime = response.time;

                    this.get('profiles').add(response.news.profiles);
                    this.get('profiles').add(response.news.groups);
                    response.news.items.forEach(function (item) {
                        if (item.source_id > 0) {
                            this.get('friendItems').add(item);
                        } else {
                            this.get('groupItems').add(item);
                        }
                    }, this);
                }.bind(this));

                Mediator.sub('newsfeed:friends:get', function () {
                    Mediator.pub('newsfeed:friends', {
                        profiles: this.get('profiles').toJSON(),
                        items: this.get('friendItems').toJSON()
                    });
                }.bind(this));
                Mediator.sub('newsfeed:groups:get', function () {
                    Mediator.pub('newsfeed:groups', {
                        profiles: this.get('profiles').toJSON(),
                        items: this.get('groupItems').toJSON()
                    });
                }.bind(this));

                this.updateOnlineStatus();
            }
        });
    }
);
