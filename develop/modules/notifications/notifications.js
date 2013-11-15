var notificationQueue = new Backbone.Collection.extend({
    initialize: function () {
        this
            .on('add remove reset', function () {
                Notifications.setBadge(notificationQueue.filter(function (model) {
                    return !model.get('noBadge');
                }).length);
            })
            .on('add', function (model) {
                if (!model.get('noSound')) {
                    Notifications.playSound();
                }
                if (!model.get('noPopup')) {
                    Notifications.createPopup(model.toJSON());
                }
            });

        Mediator.sub('auth:success', function () {
            notificationQueue.reset();
        });
        // Remove seen updates
        Mediator.sub('router:change', function (params) {
            if (params.tab && notificationQueue.size()) {
                notificationQueue.remove(notificationQueue.where({
                    type: params.tab
                }));
            }
        });
        // remove notifications about read messages
        Mediator.sub('chat:message:read', function (message) {
            if (!message.out) {
                notificationQueue.remove(notificationQueue.findWhere({
                    type: NOTIFICATIONS_CHAT
                }));
            }
        });
        Mediator.sub('notifications:queue:get', function () {
            Mediator.pub('notifications:queue', notificationQueue.toJSON());
        });
        // Clear badge, when notifications turned off and vice versa
        NotificationsSettings.on('change:enabled', function (event, enabled) {
            Notifications.setBadge(enabled ? notificationQueue.size():'', true);
        });

    }
});

exports = module.exports = {
    CHAT: 'chat',
    BUDDIES: 'buddies',
    NEWS: 'news'
};
