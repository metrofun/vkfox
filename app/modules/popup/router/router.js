angular.module('router', [])
    .config(function ($routeProvider, $locationProvider, $compileProvider) {
        $locationProvider.html5Mode(true);

        $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);

        $routeProvider
            .when('/chat', {
                templateUrl: '/modules/popup/app/chat.tmpl.html'
            })
            .when('/buddies', {
                templateUrl: '/modules/popup/app/buddies.tmpl.html'
            })
            .otherwise({
                templateUrl: '/modules/popup/app/chat.tmpl.html'
            });
    });

