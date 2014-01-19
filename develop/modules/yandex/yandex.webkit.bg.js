var Mediator = require('mediator/mediator.js'),
    PersistentModel = require('persistent-model/persistent-model.js'),
    Browser = require('browser/browser.bg.js'),

    yandexSettings = new PersistentModel({
        enabled: true,
        //show or not install dialog
        dialog: true
    }, {name: 'yandexSettings'}),

    YANDEX_QUERY_URL = 'http://yandex.ru/yandsearch?clid=149180&text=',
    GOOGLE_URLS_OVERWRITE = [
        '*://*.google.com/*sourceid=chrome*',
        '*://*.google.ru/*sourceid=chrome*',
        '*://*.google.com.ua/*sourceid=chrome*'
    ];


Mediator.sub('yandex:settings:get', function () {
    Mediator.pub('yandex:settings', yandexSettings.toJSON());
});
Mediator.sub('yandex:settings:put', function (settings) {
    yandexSettings.set(settings);
});

function googleWebRequestHandler(details) {
    var query;

    try {
        query = details.url.match(/&?q=([^&]*)/)[1];

        return {
            redirectUrl: YANDEX_QUERY_URL + query
        };
    } catch (e) {
    }
}

function updateSearch(enabled) {
    if (enabled) {
        chrome.webRequest.onBeforeRequest.addListener(
            googleWebRequestHandler,
            {urls: GOOGLE_URLS_OVERWRITE},
            ['blocking']
        );
    } else {
        chrome.webRequest.onBeforeRequest.removeListener(googleWebRequestHandler);
    }
}

// Overwrite Google Search by default
yandexSettings.on('change:enabled', function (event, enabled) {
    updateSearch(enabled);
});

updateSearch(yandexSettings.get('enabled'));

// Show install dialog only once, don't bother
if (yandexSettings.get('dialog')) {
    yandexSettings.set('dialog', false);

    //inherit legacy settings
    if (localStorage.getItem('options.yandexSearch') !== 'true') {
        Browser.createTab('/pages/install.html');
    }
}
