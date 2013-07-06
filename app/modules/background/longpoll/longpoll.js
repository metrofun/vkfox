angular.module(
    'longpoll',
    ['request', 'mediator']
).run(function (Request, Mediator) {
    var LONG_POLL_WAIT = 5;

    function enableLongPollUpdates() {
        Request.api({
            code: 'return API.messages.getLongPollServer();'
        }).then(fetchUpdates, enableLongPollUpdates);
    }
    function fetchUpdates(params) {
        Request.get('http://' + params.server, {
            act: 'a_check',
            key:  params.key,
            ts: params.ts,
            wait: LONG_POLL_WAIT,
            mode: 2
        }, 'json').then(function (response) {
            if (!response.updates) {
                enableLongPollUpdates();
                return;
            } else if (response.updates.length) {
                Mediator.pub('longpoll:updates', response.updates);
            }

            params.ts = response.ts;
            fetchUpdates(params);
        }, enableLongPollUpdates);
    }

    enableLongPollUpdates();
});

