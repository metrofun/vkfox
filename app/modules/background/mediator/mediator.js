define(['backbone', 'underscore'], function (Backbone, _) {
    var dispatcher = _.clone(Backbone.Events);

    chrome.extension.onMessage.addListener(function (messageData) {
        dispatcher.trigger.apply(dispatcher, messageData);
    });

    return {
        pub: function () {
            // dispatcher.trigger.apply(dispatcher, arguments);
            chrome.extension.sendMessage([].slice.call(arguments));
        },
        sub: function () {
            dispatcher.on.apply(dispatcher, arguments);
        },
        unsub: function () {
            dispatcher.off.apply(dispatcher, arguments);
        }
    };
});
