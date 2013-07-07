angular.module('news', ['mediator'])
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
    .controller('MyNewsController', function ($scope, Mediator) {
        Mediator.pub('feedback:data:get');
        Mediator.sub('feedback:data', function (data) {
            $scope.$apply(function () {
                $scope.data = data;
                console.log(data);
            });
        });
    })
    .controller('FriendNewsController', function ($scope, Mediator) {
        Mediator.pub('newsfeed:friends:get');
        Mediator.sub('newsfeed:friends', function (data) {
            $scope.$apply(function () {
                $scope.data = data;
            });
        });
    })
    .controller('GroupNewsController', function ($scope, Mediator) {
        Mediator.pub('newsfeed:groups:get');
        Mediator.sub('newsfeed:groups', function (data) {
            $scope.$apply(function () {
                $scope.data = data;
            });
        });
    });
