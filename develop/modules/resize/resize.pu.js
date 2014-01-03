require('angular').module('app').directive('resize', function ($rootScope) {
    var
    MOVE_DEBOUCE = 10,

    $ = require('zepto'),
    _ = require('underscore')._,
    screenX, screenY,
    dragMove = _.debounce(function (e) {
        $rootScope.$apply(function () {
            $rootScope.$broadcast('resize', screenX - e.screenX, -screenY + e.screenY);
        });
        screenX = e.screenX;
        screenY = e.screenY;
    }, MOVE_DEBOUCE);

    function dragStart(e) {
        $('.app')
            .addClass('resize__active')
            .on('mousemove', dragMove)
            .on('mouseup mouseleave', dragEnd);
        screenX = e.screenX;
        screenY = e.screenY;
    }
    function dragEnd(e) {
        console.log(e);
        $('.app')
            .removeClass('resize__active')
            .off('mouseup mouseleave', dragEnd)
            .off('mousemove', dragMove);
    }
    return {
        template: '<div class="resize"><div class="resize__handle"></div></div>',
        transclude: false,
        restrict: 'E',
        scope: false,
        replace: true,
        link: function (scope, iElement) {
            iElement.bind('mousedown', dragStart);
        }
    };
});
