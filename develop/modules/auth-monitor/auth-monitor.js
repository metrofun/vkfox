var
CHECK_AUTH_PERIOD = 3000, //ms

_ = require('underscore')._,
Config = require('modules/config/config.js'),
Request = require('modules/request/request.js'),
Auth = require('modules/auth/auth.js'),
Mediator = require('modules/mediator/mediator.js'),

userId,
/**
 * Monitor whether the user is logged/relogged on vk.com.
 * Logout if user signed out. Relogin when user id changed
 */
monitorAuthChanges = _.debounce(function () {
    Request.get(Config.VK_BASE + 'feed2.php', null, 'json').then(function (response) {
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
