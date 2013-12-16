var RETRY_INTERVAL = 10000, //ms
    CREATED = 1,
    IN_PROGRESS = 1,
    READY = 2,

    Config = require('config/config.js'),
    Mediator = require('mediator/mediator.js'),
    Env = require('env/env.js'),
    Browser = require('browser/browser.bg.js');

var _ = require('underscore')._,
    Backbone = require('backbone'),
    Vow = require('vow'),

    model = new Backbone.Model(),
    Auth, page, iframe,
    state = CREATED, authPromise = Vow.promise();

function closeAuthTabs() {
    if (Env.firefox) {
        // TODO
        // throw "Not implemented";
    } else {
        chrome.tabs.query({url: Config.AUTH_DOMAIN + '*'}, function (tabs) {
            tabs.forEach(function (tab) {
                chrome.tabs.remove(tab.id);
            });
        });
    }
}

// TODO run if one time
function tryLogin() {
    if (Env.firefox) {
        page = require("sdk/page-worker").Page({
            contentScript: 'self.postMessage(decodeURIComponent(window.location.href));',
            contentURL: Config.AUTH_URI,
            onMessage: function (url) {
                Mediator.pub('auth:iframe', url);
            }
        });
    } else {
        if (!iframe) {
            iframe = document.createElement("iframe");
            iframe.name = 'vkfox-login-iframe';
            document.body.appendChild(iframe);
        }
        iframe.setAttribute('src', Config.AUTH_URI + '&time=' + Date.now());
    }
}
function freeLogin() {
    if (Env.firefox) {
        page.destroy();
    } else {
        document.body.removeChild(iframe);
        iframe = null;
    }
    page = null;
}

function onSuccess(data) {
    state = READY;
    Browser.setIconOnline();
    authPromise.fulfill(data);
}

Mediator.sub('auth:iframe', function (url) {
    try {
        model.set('userId',  parseInt(url.match(/user_id=(\w+)(?:&|$)/i)[1], 10));
        model.set('accessToken',  url.match(/access_token=(\w+)(?:&|$)/i)[1]);

        closeAuthTabs();
        freeLogin();
    } catch (e) {
        // TODO control console.log
        console.log(e);
    }
}.bind(this));

Mediator.sub('auth:state:get', function () {
    Mediator.pub('auth:state', state);
});

Mediator.sub('auth:oauth', function () {
    Browser.createTab(Config.AUTH_URI);
});

Mediator.sub('auth:login', function (force) {
    Auth.login(force);
});

model.on('change:accessToken', function () {
    Mediator.pub('auth:success', model.toJSON());
});


module.exports = Auth = {
    retry: _.debounce(function () {
        if (state === IN_PROGRESS) {
            Auth.login(true);
            Auth.retry();
        }
    }, RETRY_INTERVAL),
    login: function (force) {
        if (force || state === CREATED) {
            Browser.setIconOffline();
            state = IN_PROGRESS;

            if (authPromise.isFulfilled()) {
                authPromise = Vow.promise();
            }

            tryLogin();
            Auth.retry();

            Mediator.unsub('auth:success', onSuccess);
            Mediator.once('auth:success', onSuccess);
        }
        return authPromise;
    },
    getAccessToken: function () {
        return Auth.login().then(function () {
            return model.get('accessToken');
        });
    },
    getUserId: function () {
        return Auth.login().then(function () {
            return model.get('userId');
        });
    }
};

Auth.login();