angular.module(
    'longpoll',
    ['request', 'mediator', 'config']
).run(function (Request, Mediator) {
    var LONG_POLL_WAIT = 20,
        FETCH_DEBOUNCE = 1000,
        fetchUpdates;

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
            if (!response.updates) {
                enableLongPollUpdates();
                return;
            } else if (response.updates.length) {
                Mediator.pub('longpoll:updates', response.updates);
            }

            params.ts = response.ts;
            fetchUpdates(params);
        });
    }, FETCH_DEBOUNCE);

    Mediator.sub('auth:success', function () {
        enableLongPollUpdates();
    });
});

