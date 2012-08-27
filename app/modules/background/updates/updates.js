define(['backbone', 'underscore', 'request/request', 'mediator/mediator'],
    function (Backbone, _, request, Mediator) {
        var
        MAX_ITEMS_COUNT = 50,

        NewsfeedModel = Backbone.Model.extend({
            defaults: {
                startTime: 'API.getServerTime() - 1 * 24 * 60 * 60'
            },
            initialize: function() {
                Mediator.sub('auth:success', function() {
                    request.api({
                        code: ['return { "news" : API.notifications.get({start_time: ',
                            this.get('startTime'), ', "count" : "', MAX_ITEMS_COUNT,
                    '"}), "time" : API.getServerTime()};'].join('')
                    }).done(function(response){
                        this.set('startTime',  response.time);
                        console.log(response);
                    }.bind(this));
                }.bind(this));
            }
        });

        new NewsfeedModel();
    }
);
