angular.module('mediator', [])
    .factory('Mediator', function () {
        var dispatcher = _.clone(Backbone.Events);

        chrome.runtime.onMessage.addListener(function (messageData) {
            dispatcher.trigger.apply(dispatcher, messageData);
            messageData = null;
        });

        return {
            pub: function () {
                chrome.runtime.sendMessage([].slice.call(arguments));
            },
            sub: function () {
                dispatcher.on.apply(dispatcher, arguments);
            },
            once: function () {
                dispatcher.once.apply(dispatcher, arguments);
            },
            unsub: function () {
                dispatcher.off.apply(dispatcher, arguments);
            }
        };
    });
