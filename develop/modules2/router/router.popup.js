angular.module('router', ['mediator', 'tracker'])
    .config(function ($routeProvider, $locationProvider, $compileProvider) {
        $locationProvider.html5Mode(true);

        $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);

        $routeProvider
            .when('/news', {
                redirectTo: '/news/my'
            })
            .when('/:tab', {
                templateUrl: function (params) {
                    return [
                        '/modules/', params.tab,
                        '/', params.tab, '.tmpl.html'
                    ].join('');
                }
            })
            .when('/:tab/:subtab', {
                templateUrl: function (params) {
                    return [
                        '/modules/', params.tab,
                        '/', params.tab, '.tmpl.html'
                    ].join('');
                }
            });
    })
    .run(function ($location, $rootScope, Mediator, Tracker) {
        // default tab is chat
        var notificationsDeferred = jQuery.Deferred(),
            authDeferred = jQuery.Deferred(),
            lastPathDeferred = jQuery.Deferred(),
            READY = 2; //ready status from auth module

        $rootScope.$on('$routeChangeSuccess', function (scope, current) {
            Mediator.pub('router:change', current.params);
            if (current.params.tab) {
                Tracker.trackPage();
                Mediator.pub('router:lastPath:put', $location.path());
            }
        });
        Mediator.sub('notifications:queue', function (queue) {
            notificationsDeferred.resolve(queue);
        });
        Mediator.sub('auth:state', function (state) {
            authDeferred.resolve(state);
        });
        Mediator.sub('router:lastPath', function (lastPath) {
            lastPathDeferred.resolve(lastPath);
        });
        jQuery.when(notificationsDeferred, authDeferred).then(function (queue, state) {
            $rootScope.$apply(function () {
                if (state === READY) {
                    if (queue.length) {
                        // queue contains updates from tabs.
                        // Property 'type' holds value
                        $location.path('/' + queue[queue.length - 1].type);
                        $location.replace();
                    } else {
                        lastPathDeferred.then(function (lastPath) {
                            $rootScope.$apply(function () {
                                $location.path(lastPath);
                                $location.replace();
                            });
                        });
                    }
                }
            });
        });
        authDeferred.then(function (state) {
            if (state !== READY) {
                Mediator.pub('auth:oauth');
                window.close();
            }
        });
        Mediator.pub('auth:state:get');
        Mediator.pub('notifications:queue:get');
        Mediator.pub('router:lastPath:get');
    });
