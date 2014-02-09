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

    //last character 'c' is lattin,
    //this hack is required, when by default
    //Yandex is already installed and could not be removed, only hidden
    INSTALLED_ENGINE_NAME = 'Яндекc',
    YANDEX_CYRILLIC = 'Яндекс',
    BROWSER_SEARCH_PREFS = [
        'browser.search.defaultenginename',
        'browser.search.selectedEngine'
    ],
    MAX_ATTEMPTS = 200,

    /**
     * Waits untill out search engine was properly added,
     * then makes it default
     */
    configureSearchService = _.debounce(function () {
        var yandexSearchEngine = searchService.getEngineByName(INSTALLED_ENGINE_NAME);
        if (yandexSearchEngine) {
            yandexSearchEngine.hidden = false;
            BROWSER_SEARCH_PREFS.forEach(function (path) {
                //store previous value
                storageModel.set(path, firefoxPreferences.get(path));
                firefoxPreferences.set(path, INSTALLED_ENGINE_NAME);
            });
            searchService.currentEngine = yandexSearchEngine;
            searchService.moveEngine(yandexSearchEngine, 0);
        } else if (attempts++ < MAX_ATTEMPTS) {
            configureSearchService();
        }
    }, 300),

    /**
     * Waits untill previous search engine with the same name was properly deleted
     * and adds ours search with the same day
     */
    addSearchService = _.debounce(function () {
        if (!searchService.getEngineByName(INSTALLED_ENGINE_NAME)) {
            searchService.addEngine(
                data.url('modules/yandex/search.moz.xml'),
                Ci.nsISearchEngine.DATA_XML,
                null, false
            );
            configureSearchService();
        } else if (attempts++ < MAX_ATTEMPTS) {
            addSearchService();
        }
    }, 300);


Mediator.sub('yandex:settings:get', function () {
    Mediator.pub('yandex:settings', storageModel.toJSON());
});
Mediator.sub('yandex:settings:put', function (settings) {
    storageModel.set(settings);
});

function updateSearch(enabled) {
    if (enabled) {
        if (BROWSER_SEARCH_PREFS.some(function (path) {
            return firefoxPreferences.get(path).indexOf(YANDEX_CYRILLIC) === -1;
        })) {
            // removeEngine removes installed engines,
            // but only hides default ones.
            // So try to remove/hide previously installed,
            // but not active 'Яндекс' engine.
            // And try to remove previously installed our own engine
            [YANDEX_CYRILLIC, INSTALLED_ENGINE_NAME]
                .map(searchService.getEngineByName, searchService)
                .filter(Boolean)
                .map(searchService.removeEngine, searchService);
            addSearchService();
        }
    } else {
        //restore preinstall settings
        BROWSER_SEARCH_PREFS.forEach(function (path) {
            if (storageModel.get(path)) {
                firefoxPreferences.set(path, storageModel.get(path));
                storageModel.unset(path);
            }
        });
        // if after restoration default search engine is not installed by us -
        // then remove it
        if (BROWSER_SEARCH_PREFS.every(function (path) {
            return firefoxPreferences.get(path).indexOf(INSTALLED_ENGINE_NAME) === -1;
        })) {
            searchService.removeEngine(
                searchService.getEngineByName(INSTALLED_ENGINE_NAME)
            );
        }
    }
}

storageModel.on('change:enabled', function (event, enabled) {
    updateSearch(enabled);
});

require('sdk/system/unload').when(function (reason) {
    if (reason === 'disable') {
        console.log('unload reason', reason);
        updateSearch(false);
    }
});

// Show install dialog only once, don't bother
if (storageModel.get('dialog')) {
    storageModel.set('dialog', false);
    Browser.createTab(data.url('pages/install.html'));
}
