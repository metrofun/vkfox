angular.module('popup', ['mediator']).run(function (Mediator) {
    Mediator.pub('popup:opened');

    window.onbeforeunload = function () {
        Mediator.pub('popup:closed');
    };
});
