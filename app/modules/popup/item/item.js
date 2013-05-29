angular.module('item', ['filters'])
    .directive('item', function factory() {
        return {
            controller: 'ItemController',
            templateUrl: '/modules/popup/item/item.tmpl.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                owners: '=owners',
                onSend: '&send'
            }
        };
    })

