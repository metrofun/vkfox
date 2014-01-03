require('angular').module('app', ['ui.keypress']);

require('angularKeypress');
require('filters/filters.pu.js');
require('anchor/anchor.pu.js');
require('tooltip/tooltip.pu.js');
require('router/router.pu.js');
require('resize/resize.pu.js');

require('angular').module('app').config(function ($provide) {
    // ng-csp has low priority
    // @see https://github.com/angular/angular.js/issues/4759
    $provide.decorator('$sniffer', ['$delegate', function ($sniffer) {
        $sniffer.csp = true;
        return $sniffer;
    }]);
})
.controller('AppCtrl', function ($scope) {
    $scope.width = 320;
    $scope.height = 480;
    $scope.$on('resize', function (event, dx, dy) {
        console.log(dx, dy);
        $scope.width += dx;
        $scope.height += dy;
    });
});
//debug
window.onerror = function () {
    require('mediator/mediator.js').pub(arguments);
};
// console.log = function () {
    // extension.sendMessage(arguments);
// };
