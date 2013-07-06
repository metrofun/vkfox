angular.module(
    'longpoll',
    ['request', 'mediator']
).run(function (Request, Mediator) {
    var LONG_POLL_WAIT = 25;

    function enableLongPollUpdates() {
        Request.api({
            code: 'return API.messages.getLongPollServer();'
        }).done(function (params) {
            fetchUpdates(params);
        });
    }
    function fetchUpdates(params) {
        Request.get('http://' + this.params.server, {
            act: 'a_check',
            key:  this.params.key,
            ts: this.params.ts,
            wait: LONG_POLL_WAIT,
            mode: 2
        }, function (response) {
            var data = JSON.parse(jQuery.trim(response));

            if (!data.updates) {
                enableLongPollUpdates();
                return;
            } else {
                Mediator.pub('longpoll:updates', data.updates);
            }

            params.ts = data.ts;
            fetchUpdates(params);
        }, 'text').fail(function () {
            enableLongPollUpdates();
        });
    }

    enableLongPollUpdates();
});

