var Vow = require('vow'),
    Mediator = require('mediator/mediator.js'),
    PersistentModel = require('persistent-model/persistent-model.js'),

    model = new PersistentModel(
        {lastPath: '/chat'},
        {name: 'router'}
    );

    // TODO
    // Tracker = require('tracker/tracker.js');

location.hash = model.get('lastPath');
require('buddies/buddies.pu.js');
require('settings/settings.pu.js');
require('news/news.pu.js');
require('chat/chat.pu.js');
require('angular').module('app')
    .config(function ($routeProvider, $locationProvider, $compileProvider, $provide) {
        // Make Addon SDK compatible
        $provide.decorator('$sniffer', function ($delegate) {
            $delegate.history = false;
            return $delegate;
        });
        $locationProvider.html5Mode(false);

        $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension|resource):/);

        $routeProvider
            .when('/news', {
                redirectTo: '/news/my'
            })
            .when('/:tab', {
                templateUrl: function (params) {
                    return [
                        'modules/', params.tab,
                        '/', params.tab, '.tmpl.html'
                    ].join('');
                }
            })
            .when('/:tab/:subtab', {
                templateUrl: function (params) {
                    return [
                        'modules/', params.tab,
                        '/', params.tab, '.tmpl.html'
                    ].join('');
                }
            });
    })
    .run(function ($location, $rootScope) {
        // default tab is chat
        var notificationsPromise = Vow.promise(),
            authPromise = Vow.promise(),
            READY = 2; //ready status from auth module

        $rootScope.$on('$routeChangeSuccess', function (scope, current) {
            var path;
            Mediator.pub('router:change', current.params);
            if (current.params.tab) {
                // TODO
                // Tracker.trackPage();
                path = $location.path();
                model.set('lastPath', path);
                Mediator.pub('router:lastPath:put', path);
            }
        });
        Mediator.sub('notifications:queue', function (queue) {
            notificationsPromise.fulfill(queue);
        });
        Mediator.sub('auth:state', function (state) {
            authPromise.fulfill(state);
        });
        Vow.all([notificationsPromise, authPromise]).spread(function (queue, state) {
            $rootScope.$apply(function () {
                if (state === READY) {
                    if (queue.length) {
                        // queue contains updates from tabs.
                        // Property 'type' holds value
                        $location.path('/' + queue[queue.length - 1].type);
                        $location.replace();
                    }
                }
            });
        });
        authPromise.then(function (state) {
            if (state !== READY) {
                Mediator.pub('auth:oauth');
                window.close();
            }
        });
        Mediator.pub('auth:state:get');
        Mediator.pub('notifications:queue:get');
    });
