angular.module('app', ['i18n', 'anchor', 'mediator'])
    .controller('AppCtrl', function ($scope, Mediator) {
        var data = {
            // authorization  step
            '0': {
                mainText: 'Authorize VKfox with Vkontakte',
                buttonLabels: {
                    no: 'skip',
                    yes: 'login'
                },
                onButtonClick: function (makeAuth) {
                    if (makeAuth) {
                        Mediator.once('auth:success', function () {
                            $scope.$apply(function () {
                                $scope.step++;
                            });
                        });
                        Mediator.pub('auth:oauth');
                    } else {
                        $scope.step++;
                    }
                }
            },
            // licence agreement
            '1': {
                mainText: 'Accept license agreement',
                buttonLabels: {
                    no: null,
                    yes: 'accept'
                },
                onButtonClick: function () {
                    $scope.step++;
                }
            },
            // yandex installation
            '2': {
                mainText: 'Install Yandex search',
                buttonLabels: {
                    no: 'no',
                    yes: 'install_verb'
                },
                onButtonClick: function (install) {
                    $scope.step++;

                    Mediator.pub('yandex:settings:put', {
                        enabled: install
                    });
                }
            },
            // thanks and close
            '3': {
                mainText: 'Thank you!',
                buttonLabels: {
                    no: null,
                    yes: 'close'
                },
                onButtonClick: function () {
                    window.close();
                }
            }
        };

        $scope.next = function () {
            $scope.step++;
        };
        $scope.$watch('step', function () {
            $scope.progress = Math.min(
                100 * (1 / 6 + $scope.step * 1 / 3),
                100
            );
            angular.extend($scope, data[$scope.step]);
            $scope.noButton = data[$scope.step].noButton;
        });
        $scope.step = 0;
    });

