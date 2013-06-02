angular.module('item', ['filters'])
    .controller('ItemController', function ($scope) {
        $scope.$watch('owners', function () {
            var owners = [].concat($scope.owners);

            if (owners.length === 1) {
                $scope.owner = owners[0];
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
                owners: '=owners',
                class: '@class'
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
                type: '@type',
                data: '=data'
            }
        };
    })
    .filter('isObject', function () {
        return function (input) {
            return angular.isObject(input);
        };
    });


