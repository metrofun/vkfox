define(['backbone', 'underscore'], function(Backbone, _){
    var dispatcher = _.clone(Backbone.Events);

    return {
        pub: function(){
            dispatcher.trigger.apply(dispatcher, arguments);
        },
        sub: function() {
            dispatcher.on.apply(dispatcher, arguments);
        },
        unsub: function() {
            dispatcher.off.apply(dispatcher, arguments);
        }
    };
});
