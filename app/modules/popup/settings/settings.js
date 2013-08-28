angular.module('settings', [])
    .controller('settingsNotificationsCtrl', function ($scope, Mediator) {
        Mediator.sub('notifications:settings', function (settings) {
            $scope.$apply(function () {
                $scope.notifications = settings;
            });

            $scope.$watch('notifications', function (settings) {
                Mediator.pub('notifications:settings:put', settings);
            }, true);
            $scope.$watchCollection('notifications.sound', _.debounce(function () {
                var audio = new Audio(),
                    sound = $scope.notifications.sound;

                audio.volume = sound.volume;
                audio.src = sound.signal;
                audio.play();
                audio.addEventListener('ended', function () {
                });
            }, 300), true);
        });
        Mediator.pub('notifications:settings:get');
    });
