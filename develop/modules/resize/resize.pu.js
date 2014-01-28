require('angular').module('app').directive('resize', function () {
    var
    MOVE_DEBOUCE = 10,
    DEFAULT_WIDTH = 320,
    MAX_WIDTH = 640,
    MIN_WIDTH = 230,
    DEFAULT_HEIGHT = 480,
    MAX_HEIGHT = 600,
    MIN_HEIGHT = 375,
    DEFAULT_FONT_SIZE = 12,

    PersistentModel = require('persistent-model/persistent-model.js'),
    model = new PersistentModel({
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        fontSize: DEFAULT_FONT_SIZE
    }, {name: 'resize'}),

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

        width = Math.max(
            MIN_WIDTH,
            Math.min(MAX_WIDTH, model.get('width') + dx)
        );
        height = Math.max(
            MIN_HEIGHT,
            Math.min(MAX_HEIGHT, model.get('height') + dy)
        );
        fontSize = DEFAULT_FONT_SIZE + Math.round(
            (width / DEFAULT_WIDTH - 1) * DEFAULT_FONT_SIZE / 2
        );
        model.set('width', width);
        model.set('height', height);
        model.set('fontSize', fontSize);
        root.css(model.toJSON());
    }, MOVE_DEBOUCE);

    function dragStart(e) {
        root
            .addClass('resize__active')
            .on('mousemove', dragMove)
            .on('mouseup mouseleave', dragEnd);
        screenX = e.screenX;
        screenY = e.screenY;
    }
    function dragEnd() {
        root
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
