angular.module('app', ['router', 'item', 'filters', 'news', 'chat'])
    .controller('navigationCtrl', function ($scope, $location) {
        $scope.locationPath = $location.path();
        $scope.location = $location;
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
    .controller('buddiesCtrl', function ($scope, mediator) {
        var PRELOAD_ITEMS = 15;

        mediator.pub('buddies:data:get');
        mediator.sub('buddies:data', function (data) {
            $scope.$apply(function () {
                $scope.data = data.slice(0, PRELOAD_ITEMS);
            });
        }.bind(this));
    })

