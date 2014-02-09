var _ = require('underscore')._,
    Env = require('env/env.js'),
    NotificationsSettings = require('notifications/settings.js'),
    Mediator = require('mediator/mediator.js');

require('checkbox/checkbox.pu.js');
require('angular')
    .module('app')
    .controller('settingsSignalCtrl', function ($scope) {
        $scope.signals = Object.keys(NotificationsSettings);
    })
    .controller(
        'settingsNotificationsCtrl',
        function ($scope) {
            /**
             * Similar interface for simple modules
             */
            ['forceOnline', Env.chrome && 'yandex', 'notifications']
                .filter(Boolean).forEach(function (moduleName) {
                    console.log(moduleName);
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
                        audio.src = NotificationsSettings[sound.signal];
                        audio.play();
                    }
                }, 300);

                $scope.$watch('notifications.sound.volume', onSoundAdjust, true);
                $scope.$watch('notifications.sound.signal', onSoundAdjust, true);
            });
            Mediator.pub('notifications:settings:get');
        }
    );
