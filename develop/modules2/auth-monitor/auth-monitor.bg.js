angular.module('auth-monitor', ['auth', 'config', 'request', 'mediator']).run(function (Auth, Mediator, Request, VK_BASE) {
    var CHECK_AUTH_PERIOD = 3000, //ms

    userId,
    /**
     * Monitor whether the user is logged/relogged on vk.com.
     * Logout if user signed out. Relogin when user id changed
     */
    monitorAuthChanges = _.debounce(function () {
        Request.get(VK_BASE + 'feed2.php', null, 'json').then(function (response) {
            try {
                if (userId !== Number(response.user.id)) {
                    Auth.login(true);
                } else {
                    monitorAuthChanges();
                }
            } catch (e) {
                Auth.login(true);
            }
        }, monitorAuthChanges);
    }, CHECK_AUTH_PERIOD);

    Mediator.sub('auth:success', function (data) {
        userId = data.userId;
        monitorAuthChanges();
    });
});
