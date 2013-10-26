angular.module('settings', [])
    .controller('settingsNotificationsCtrl', function ($scope, Mediator) {
        /**
         * Similar interface for simple modules
         */
        ['forceOnline', 'yandex'].forEach(function (moduleName) {
            Mediator.sub(moduleName + ':settings', function (settings) {
                $scope.$apply(function () {
                    $scope[moduleName] = settings;
                });

                $scope.$watch(moduleName, function (settings) {
                    Mediator.pub(moduleName + ':settings:put', settings);
                }, true);
            });
            Mediator.pub(moduleName + ':settings:get');
            console.log(moduleName + ':settings:get');
        })
        /**
         * Notifications
         */
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
        /**
         * Yandex
         */
        Mediator.sub('yandex:settings', function (settings) {
            $scope.$apply(function () {
                $scope.yandex = settings;
            });

            $scope.$watch('yandex', function (settings) {
                Mediator.pub('yandex:settings:put', settings);
            }, true);
        });
        Mediator.pub('yandex:settings:get');
    });
