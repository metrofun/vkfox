angular.module('item', ['filters', 'ui.keypress'])
    .controller('ItemController', function ($scope) {
        $scope.$watch('owners', function () {
            var owners = [].concat($scope.owners);

            if (owners.length === 1) {
                $scope.owner = owners[0];
            }
            $scope.callback = function () {
                console.log(arguments);
            }
        });
    })
    .directive('item', function factory() {
        return {
            controller: 'ItemController',
            templateUrl: '/modules/popup/item/item.tmpl.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                owners: '=',
                showReply: '=',
                onReply: '&',
                class: '@'
            }
        };
    })
    .directive('attachment', function factory() {
        return {
            templateUrl: '/modules/popup/item/attachment.tmpl.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                type: '@',
                data: '='
            }
        };
    })
    .directive('actions', function factory() {
        return {
            template: '<div class="item__actions" ng-transclude></div>',
            replace: true,
            transclude: true,
            restrict: 'E'
        };
    })
    .directive('action', function factory() {
        return {
            template: '<i class="item__action" ng-transclude></i>',
            replace: true,
            transclude: true,
            restrict: 'E'
        };
    })
    .filter('isObject', function () {
        return function (input) {
            return angular.isObject(input);
        };
    });


