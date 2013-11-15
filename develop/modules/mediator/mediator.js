var _ = require('underscore')._,
    Backbone = require('backbone'),
    dispatcher = _.clone(Backbone.Events);

module.exports = {
    pub: function () {
        dispatcher.trigger.apply(dispatcher, arguments);
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

