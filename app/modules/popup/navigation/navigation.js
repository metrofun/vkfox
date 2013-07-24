angular.module('navigation', ['ui.route'])
    .directive('navigation', function ($routeParams) {
        return {
            controller: function ($scope) {
                $scope.tabs = [
                    {
                        href: 'chat',
                        name: 'Chat'
                    },
                    {
                        href: 'news',
                        name: 'News'
                    },
                    {
                        href: 'buddies',
                        name: 'Buddies'
                    }
                ];
                $scope.activeTab = $routeParams.tab;
            },
            templateUrl: '/modules/popup/navigation/navigation.tmpl.html',
            replace: true,
            restrict: 'E'
        };
    });
