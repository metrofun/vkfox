angular.module('force-online', ['mediator',  'persistent-model', 'request'])
.factory('ForceOnlineSettings', function (Mediator, PersistentModel) {
    var forceOnlineSettings = new PersistentModel({
        enabled: false
    }, {name: 'forceOnline'});

    Mediator.sub('forceOnline:settings:get', function () {
        Mediator.pub('forceOnline:settings', forceOnlineSettings.toJSON());
    });
    Mediator.sub('forceOnline:settings:put', function (settings) {
        forceOnlineSettings.set(settings);
    });

    return forceOnlineSettings;
})
.run(function (ForceOnlineSettings, Request) {
    var MARK_PERIOD = 5 * 60 * 1000, //5 min
        timeoutId;

    function markAsOnline() {
         clearTimeout(timeoutId);
         messageDeferred = Request.api({code: 'return API.account.setOnline();'});
         timeoutId = setTimeout(markAsOnline, MARK_PERIOD);
    }

    if (ForceOnlineSettings.get('enabled')) {
        markAsOnline();
    }

    ForceOnlineSettings.on('change:enabled', function (event, enabled) {
        if (enabled) {
            markAsOnline();
        } else {
            clearTimeout(timeoutId);
        }
    });
});
