var Mediator = require('mediator/mediator.js'),
    PersistentModel = require('persistent-model/persistent-model.js'),
    Browser = require('browser/browser.bg.js'),
    _ = require('underscore')._,
    data = require('sdk/self').data,

    attempts = 0,
    firefoxPreferences = require('firefox-preferences/firefox-preferences.bg.js'),
    chromeModule = require('chrome'),
    Cc = chromeModule.Cc,
    Ci = chromeModule.Ci,
    searchService = Cc["@mozilla.org/browser/search-service;1"].getService(Ci.nsIBrowserSearchService),
    storageModel = new PersistentModel({
        enabled: false,
        //show or not install dialog
        dialog: true
    }, {name: 'yandexSettings'}),

    YANDEX_CYRILLIC = 'Яндекс',
    MAX_ATTEMPTS = 100;

Mediator.sub('yandex:settings:get', function () {
    Mediator.pub('yandex:settings', storageModel.toJSON());
});
Mediator.sub('yandex:settings:put', function (settings) {
    storageModel.set(settings);
});

function configureSearchService() {
    var yandexSearchEngine = searchService.getEngineByName(YANDEX_CYRILLIC);
    if (yandexSearchEngine) {
        yandexSearchEngine.hidden = false;
        ['browser.search.defaultenginename', 'browser.search.selectedEngine'].forEach(function (path) {
            //store previous value
            storageModel.set(path, firefoxPreferences.get(path));
            firefoxPreferences.set(path, YANDEX_CYRILLIC);
        });
        searchService.currentEngine = yandexSearchEngine;
        searchService.moveEngine(yandexSearchEngine, 0);
    } else if (attempts++ < MAX_ATTEMPTS) {
        _.defer(configureSearchService, 300);
    }
}

function updateSearch(enabled) {
    if (enabled) {
        if (!searchService.getEngineByName(YANDEX_CYRILLIC)) {
            searchService.addEngine(
                data.url('modules/yandex/search.moz.xml'),
                Ci.nsISearchEngine.DATA_XML,
                null, false
            );
            configureSearchService();
            //mark that we have installed a new search engine
            storageModel.set('addEngine', true);
        }
    } else {
        //restore preinstall settings
        ['browser.search.defaultenginename', 'browser.search.selectedEngine'].forEach(function (path) {
            if (storageModel.get(path)) {
                firefoxPreferences.set(path, storageModel.get(path));
                storageModel.unset(path);
            }
        });
        if (storageModel.get('addEngine')) {
            searchService.removeEngine(searchService.getEngineByName(YANDEX_CYRILLIC));
            storageModel.unset('addEngine');
        }
    }
}

storageModel.on('change:enabled', function (event, enabled) {
    updateSearch(enabled);
});

require('sdk/system/unload').when(function (reason) {
    if (reason === 'uninstall') {
        updateSearch(false);
    }
});

// Show install dialog only once, don't bother
if (storageModel.get('dialog')) {
    storageModel.set('dialog', false);
    Browser.createTab(data.url('pages/install.html'));
}
