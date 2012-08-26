define(['backbone', 'underscore', 'request/request', 'mediator/mediator'],
    function (Backbone, _, request, Mediator){
        var
        MAX_ITEMS_COUNT = 50,

        NewsfeedCollection = Backbone.Collection.extend({
            startTime: 'API.getServerTime() - 1 * 24 * 60 * 60',

            initialize: function() {
                Mediator.sub('auth:success', function() {
                    request.queryApi({
                        code: ['{ "news" : API.newsfeed.get({start_time: ',
                            this.startTime, ', "count" : "', MAX_ITEMS_COUNT,
                        '"}), "time" : API.getServerTime()}'].join('')
                    }).done(function(){
                        console.log(arguments);
                    });
                }.bind(this));
            }
        });

        new NewsfeedCollection();
    }
);
