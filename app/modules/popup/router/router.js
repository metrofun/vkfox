angular.module('router', [])
    .config(function ($routeProvider, $locationProvider, $compileProvider) {
        $locationProvider.html5Mode(true);

        $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);

        $routeProvider
            .when('/chat', {
                templateUrl: '/modules/popup/chat/chat.tmpl.html'
            })
            .when('/buddies', {
                templateUrl: '/modules/popup/app/buddies.tmpl.html'
            })
            .when('/news', {
                redirectTo: '/news/friends'
            })
            .when('/news/:tab', {
                controller: 'NewsController',
                templateUrl: '/modules/popup/news/news.tmpl.html'
            })
            .otherwise({
                redirectTo: '/news'
            });
    });

