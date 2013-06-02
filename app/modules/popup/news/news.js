angular.module('news', [])
    .controller('NewsController', function ($scope, $routeParams) {
        $scope.tabs = [
            {
                href: '/news/my',
                text: 'My'
            },
            {
                href: '/news/friends',
                text: 'Friends'
            },
            {
                href: '/news/groups',
                text: 'Groups'
            }
        ];

        $scope.activeTab = $routeParams.tab;
    })
    .controller('MyNewsController', function ($scope, mediator) {
        mediator.pub('feedback:data:get');
        mediator.sub('feedback:data', function (data) {
            $scope.$apply(function () {
                $scope.data = data;
                console.log(data);
            });
        });
    })
    .controller('FriendNewsController', function ($scope, mediator) {
        mediator.pub('newsfeed:friends:get');
        mediator.sub('newsfeed:friends', function (data) {
            $scope.$apply(function () {
                $scope.data = data;
            });
        });
    });
