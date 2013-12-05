var LONG_POLL_WAIT = 20,
    FETCH_DEBOUNCE = 1000,
    fetchUpdates,

    _ = require('underscore')._,
    Request = require('request/request.bg.js'),
    Mediator = require('mediator/mediator.js');

function enableLongPollUpdates() {
    Request.api({
        code: 'return API.messages.getLongPollServer();'
    }).then(fetchUpdates);
}
fetchUpdates = _.debounce(function (params) {
    Request.get('http://' + params.server, {
        act: 'a_check',
        key:  params.key,
        ts: params.ts,
        wait: LONG_POLL_WAIT,
        mode: 2
    }, 'json').then(function (response) {
        console.log(response);
        if (!response.updates) {
            enableLongPollUpdates();
            return;
        } else if (response.updates.length) {
            Mediator.pub('longpoll:updates', response.updates);
        }

        params.ts = response.ts;
        fetchUpdates(params);
    }, enableLongPollUpdates).done();
}, FETCH_DEBOUNCE);

Mediator.sub('auth:success', function () {
    enableLongPollUpdates();
});
