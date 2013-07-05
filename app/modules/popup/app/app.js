angular.module('app', ['router', 'item', 'common', 'news', 'chat', 'buddies'])
    .run(function () {
        jQuery('body').tooltip({
            selector: '[title]',
            container: '.app',
            delay: { show: 1000, hide: false}
        });
    })
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
    });
