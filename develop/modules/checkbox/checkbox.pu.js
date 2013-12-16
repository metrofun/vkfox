require('angular').module('app').directive('checkbox', function () {
    return {
        templateUrl: 'modules/checkbox/checkbox.tmpl.html',
        replace: true,
        restrict: 'E',
        require: 'ngModel',
        transclude: true,
        scope: {
            class: '@',
            model: '=ngModel',
            disabled: '=ngDisabled'
        }
    };
});
