angular.module('popup', ['mediator']).run(function (Mediator) {
    Mediator.pub('popup:opened');

    window.addEventListener('unload', function () {
        Mediator.pub('popup:closed');
    });
});
