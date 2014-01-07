require('angular').module('app').directive('resize', function () {
    var
    MOVE_DEBOUCE = 10,
    DEFAULT_WIDTH = 320,
    DEFAULT_HEIGHT = 480,
    DEFAULT_FONT_SIZE = 12,

    PersistentModel = require('persistent-model/persistent-model.js'),
    model = new PersistentModel({
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        fontSize: DEFAULT_FONT_SIZE
    }, {name: 'AppModel'}),

    $ = require('zepto'),
    _ = require('underscore')._,
    root = $('html'),
    screenX, screenY,
    dragMove = _.debounce(function (e) {
        var dx = screenX - e.screenX,
            dy = -screenY + e.screenY,
            width, height, fontSize;

        screenX = e.screenX;
        screenY = e.screenY;

        width = model.get('width') + dx;
        height = model.get('height') + dy;
        fontSize = DEFAULT_FONT_SIZE + Math.round(
            (width / DEFAULT_WIDTH - 1) * DEFAULT_FONT_SIZE / 2
        );
        model.set('width', width);
        model.set('height', height);
        model.set('fontSize', fontSize);
        root.css(model.toJSON());
    }, MOVE_DEBOUCE);

    function dragStart(e) {
        $('.app')
            .addClass('resize__active')
            .on('mousemove', dragMove)
            .on('mouseup mouseleave', dragEnd);
        screenX = e.screenX;
        screenY = e.screenY;
    }
    function dragEnd() {
        $('.app')
            .removeClass('resize__active')
            .off('mouseup mouseleave', dragEnd)
            .off('mousemove', dragMove);
    }
    root.css(model.toJSON());
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
