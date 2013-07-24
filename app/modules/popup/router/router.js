angular.module('router', [])
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
    .run(function ($location) {
        //default tab
        $location.path('/buddies');
        $location.replace();
    });

