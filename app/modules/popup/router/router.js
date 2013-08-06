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
    .run(function ($location, $rootScope, Mediator, PersistentModel, AUTH_URI) {
        // default tab is chat
        var model = new PersistentModel(
            {lastPath: '/chat'},
            {name: 'router'}
        ), notificationsDeferred = jQuery.Deferred(),
        authDeferred = jQuery.Deferred(),
        READY = 2; //ready status from auth module

        $rootScope.$on('$routeChangeSuccess', function (scope, current) {
            Mediator.pub('router:change', current.params);
            if (current.params.tab) {
                model.set('lastPath', $location.path());
            }
        });
        Mediator.sub('notifications:queue', function (queue) {
            notificationsDeferred.resolve(queue);
        });
        Mediator.sub('auth:state', function (state) {
            authDeferred.resolve(state);
        });
        jQuery.when(notificationsDeferred, authDeferred).then(function (queue, state) {
            $rootScope.$apply(function () {
                if (state === READY) {
                    if (queue.length) {
                        // queue contains updates from tabs.
                        // Property 'type' holds value
                        $location.path('/' + queue[queue.length - 1].type);
                    } else {
                        $location.path(model.get('lastPath'));
                    }
                    $location.replace();
                } else {
                    Mediator.pub('auth:relogin');
                    window.close();
                }
            });
        });
        Mediator.pub('notifications:queue:get');
        Mediator.pub('auth:state:get');
    });
