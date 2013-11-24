var MARK_PERIOD = 5 * 60 * 1000, //5 min

    Mediator = require('mediator/mediator.js'),
    Request = require('request/request.bg.js'),
    PersistentModel = require('persistent-model/persistent-model.js'),

    timeoutId, settings = new PersistentModel({
        enabled: false
    }, {name: 'forceOnline'});

Mediator.sub('forceOnline:settings:get', function () {
    Mediator.pub('forceOnline:settings', settings.toJSON());
});
Mediator.sub('forceOnline:settings:put', function (settings) {
    settings.set(settings);
});

function markAsOnline() {
    clearTimeout(timeoutId);
    Request.api({code: 'return API.account.setOnline();'});
    timeoutId = setTimeout(markAsOnline, MARK_PERIOD);
}

if (settings.get('enabled')) {
    markAsOnline();
}

settings.on('change:enabled', function (event, enabled) {
    if (enabled) {
        markAsOnline();
    } else {
        clearTimeout(timeoutId);
    }
});
