angular.module('item', [])
    .controller('ItemController', function ($scope) {
    })
    .directive('item', function factory() {
        return {
            controller: 'ItemController',
            templateUrl: '/modules/popup/item/item.tmpl.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                onSend: '&send'
            }
        };
    })
    .directive('image', function factory() {
        return {
            require: '^item',
            templateUrl: '/modules/popup/item/image.tmpl.html',
            replace: true,
            transclude: true,
            restrict: 'AE',
        };
    })
    .directive('content', function factory() {
        return {
            require: '^item',
            templateUrl: '/modules/popup/item/content.tmpl.html',
            replace: true,
            transclude: true,
            restrict: 'E',
        };
    });
