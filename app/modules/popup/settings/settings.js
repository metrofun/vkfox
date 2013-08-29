angular.module('settings', [])
    .controller('settingsNotificationsCtrl', function ($scope, Mediator) {
        Mediator.sub('notifications:settings', function (settings) {
            var onSoundAdjust = _.debounce(function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    var audio = new Audio(),
                    sound = $scope.notifications.sound;

                    audio.volume = sound.volume;
                    audio.src = sound.signal;
                    audio.play();
                }
            }, 300);

            $scope.$apply(function () {
                $scope.notifications = settings;
            });

            $scope.$watch('notifications', function (settings) {
                Mediator.pub('notifications:settings:put', settings);
            }, true);
            $scope.$watch('notifications.sound.volume', onSoundAdjust, true);
            $scope.$watch('notifications.sound.signal', onSoundAdjust, true);
        });
        Mediator.pub('notifications:settings:get');
    });
