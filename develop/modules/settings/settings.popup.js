angular.module('settings', ['browser', 'notifications'])
    .controller('settingsSignalCtrl', function ($scope, NOTIFICATIONS_SOUNDS) {
        $scope.signals = Object.keys(NOTIFICATIONS_SOUNDS);
    })
    .controller(
        'settingsNotificationsCtrl',
        function ($scope, Mediator, BROWSER_IS_OPERA, NOTIFICATIONS_SOUNDS) {
            /**
             * Similar interface for simple modules
             */
            ['forceOnline', !BROWSER_IS_OPERA && 'yandex', 'notifications']
                .filter(Boolean).forEach(function (moduleName) {
                    Mediator.sub(moduleName + ':settings', function (settings) {
                        $scope.$apply(function () {
                            $scope[moduleName] = settings;
                        });

                        $scope.$watch(moduleName, function (settings) {
                            Mediator.pub(moduleName + ':settings:put', settings);
                        }, true);
                    });
                    $scope.$on('$destroy', function () {
                        Mediator.unsub(moduleName + ':settings');
                    });
                    Mediator.pub(moduleName + ':settings:get');
                });
            /**
             * Notifications
             */
            Mediator.sub('notifications:settings', function () {
                var onSoundAdjust = _.debounce(function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        var audio = new Audio(),
                            sound = $scope.notifications.sound;

                        audio.volume = sound.volume;
                        audio.src = NOTIFICATIONS_SOUNDS[sound.signal];
                        audio.play();
                    }
                }, 300);

                $scope.$watch('notifications.sound.volume', onSoundAdjust, true);
                $scope.$watch('notifications.sound.signal', onSoundAdjust, true);
            });
            Mediator.pub('notifications:settings:get');
        }
    );
