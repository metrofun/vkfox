var
Mediator = require('mediator/mediator.js'),
PersistentModel = require('persistent-model/persistent-model.js'),

model = new PersistentModel(
    {lastPath: '/chat'},
    {name: 'router'}
);

Mediator.sub('router:lastPath:get', function () {
    Mediator.pub('router:lastPath', model.get('lastPath'));
});
Mediator.sub('router:lastPath:put', function (lastPath) {
    model.set('lastPath', lastPath);
});

module.exports = {
    /**
    * Returns true if an active tab in a popup is a feedbacks tab
    *
    * @returns {Boolean}
    */
    isFeedbackTabActive: function () {
        return model.get('lastPath').indexOf('my') !== -1;
    },
    /**
    * Returns true if an active tab in a popup is a chat tab
    *
    * @returns {Boolean}
    */
    isChatTabActive: function () {
        return model.get('lastPath').indexOf('chat') !== -1;
    }
};
