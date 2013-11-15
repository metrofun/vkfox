angular.module('navigation', ['ui.route'])
    .directive('navigation', function ($routeParams) {
        return {
            controller: function ($scope) {
                $scope.tabs = [
                    {
                        href: 'chat',
                        name: 'chat'
                    },
                    {
                        href: 'news',
                        name: 'news'
                    },
                    {
                        href: 'buddies',
                        name: 'buddies'
                    }
                ];
                $scope.activeTab = $routeParams.tab;
            },
            templateUrl: '/modules/navigation/navigation.tmpl.html',
            replace: true,
            restrict: 'E'
        };
    });
