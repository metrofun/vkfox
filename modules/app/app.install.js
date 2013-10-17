angular.module('app', ['i18n', 'anchor'])
    .controller('AppCtrl', function ($scope) {
        $scope.next = function (value) {
            $scope.step++;
        };
        $scope.$watch('step', function () {
            $scope.progress = Math.min(
                100 * (1 / 6 + $scope.step * 1 / 3),
                100
            );
        });
        $scope.data = {
            '0': {
                yesButton: 'login',
                noButton: 'skip',
                mainText: 'Authorize VKfox with Vkontakte'
            },
            '1': {
                yesButton: 'accept',
                mainText: 'Accept license agreement'
            },
            '2': {
                yesButton: 'install_verb',
                noButton: 'no',
                mainText: 'Install Yandex search'
            }
        };
        $scope.step = 0;
    });

