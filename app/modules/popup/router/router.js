angular.module('router', ['mediator', 'persistent-model'])
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
                        '/modules/popup/', params.tab,
                        '/', params.tab, '.tmpl.html'
                    ].join('');
                }
            })
            .when('/:tab/:subtab', {
                templateUrl: function (params) {
                    return [
                        '/modules/popup/', params.tab,
                        '/', params.tab, '.tmpl.html'
                    ].join('');
                }
            });
    })
    .run(function ($location, $rootScope, Mediator, PersistentModel) {
        // default tab is chat
        var model = new PersistentModel(
            {lastPath: '/chat'},
            {name: 'router'}
        );
        $rootScope.$on('$routeChangeSuccess', function (scope, current) {
            Mediator.pub('router:change', current.params);
            if (current.params.tab) {
                model.set('lastPath', $location.path());
            }
        });
        Mediator.sub('notifications:queue', function (queue) {
            $rootScope.$apply(function () {
                if (queue.length) {
                    // queue contains updates from tabs.
                    // Property 'type' holds value
                    $location.path('/' + queue[queue.length - 1].type);
                } else {
                    $location.path(model.get('lastPath'));
                }
                $location.replace();
            });
        });
        Mediator.pub('notifications:queue:get');
    });
