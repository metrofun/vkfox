angular.module('yandex', ['mediator',  'persistent-model'])
.constant('YANDEX_QUERY_URL', 'http://beta.yandex.ru/yandsearch?clid=149180&text=')
.constant('GOOGLE_URLS_OVERWRITE', [
    '*://*.google.com/*sourceid=chrome*',
    '*://*.google.ru/*sourceid=chrome*',
    '*://*.google.com.ua/*sourceid=chrome*'
])
.factory('googleWebRequestHandler', function (YANDEX_QUERY_URL) {
    return function (details) {
        var query;

        try {
            query = details.url.match(/&?q=([^&]*)/)[1];

            return {
                redirectUrl: YANDEX_QUERY_URL + query
            };
        } catch (e) {
        }
    };
})
.factory('YandexSettings', function (Mediator, PersistentModel) {
    var yandexSettings = new PersistentModel({
        enabled: true
    }, {name: 'yandexSettings'});

    Mediator.sub('yandex:settings:get', function () {
        Mediator.pub('yandex:settings', yandexSettings.toJSON());
    });
    Mediator.sub('yandex:settings:put', function (settings) {
        yandexSettings.set(settings);
    });

    return yandexSettings;
})
.run(function (googleWebRequestHandler, GOOGLE_URLS_OVERWRITE, YandexSettings) {
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
    updateSearch(true);

    YandexSettings.on('change:enabled', function (event, enabled) {
        updateSearch(enabled);
    });
});
