angular.module('news', [])
    .controller('NewsController', function ($scope, $routeParams) {
        $scope.tabs = [
            {
                href: '/news/my',
                text: 'My'
            },
            {
                href: '/news/feed',
                text: 'Feed'
            }
        ];

        $scope.activeTab = $routeParams.tab;
    })
    .controller('FeedbackController', function ($scope, mediator) {
        mediator.pub('feedback:data:get');
        mediator.sub('feedback:data', function (data) {
            $scope.$apply(function () {
                $scope.data = data;
                console.log(data);
            });
        });
    });
