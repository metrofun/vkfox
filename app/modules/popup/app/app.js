angular.module('app', ['router', 'item', 'common', 'news', 'chat', 'buddies'])
    .controller('navigationCtrl', function ($scope, $location) {
        $scope.locationPath = $location.path();
        $scope.$watch('location.path()', function (path) {
            $scope.locationPath = path;
        });
        $scope.tabs = [
            {
                href: '/chat',
                name: 'Chat'
            },
            {
                href: '/buddies',
                name: 'Buddies'
            },
            {
                href: '/news',
                name: 'News'
            }
        ];
    })

