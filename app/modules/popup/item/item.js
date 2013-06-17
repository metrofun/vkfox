angular.module('item', ['filters', 'ui.keypress', 'request'])
    .directive('item', function factory() {
        return {
            controller: function ($scope) {
                var self = this;

                $scope.$watch('owners', function () {
                    var owners = [].concat($scope.owners);

                    if (owners.length === 1) {
                        $scope.owner = owners[0];
                    }
                    $scope.callback = function () {
                        console.log(arguments);
                    }
                });

                $scope.reply = {
                    visible: false
                };

                this.showReply = function (onSend, placeholder) {
                    $scope.reply.onSend = onSend;
                    $scope.reply.placeholder = placeholder;
                    $scope.reply.visible = !$scope.reply.visible;
                };

                $scope.onReply = function (message) {
                    $scope.reply.visible = false;
                    $scope.reply.onSend(message);
                };
            },
            templateUrl: '/modules/popup/item/item.tmpl.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                owners: '=',
                reply: '=',
                class: '@'
            }
        };
    })
    .directive('attachment', function factory() {
        return {
            templateUrl: '/modules/popup/item/attachment.tmpl.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                type: '@',
                data: '='
            }
        };
    })
    .directive('actions', function factory() {
        return {
            template: '<div class="item__actions" ng-transclude></div>',
            replace: true,
            transclude: true,
            restrict: 'E'
        };
    })
    .directive('action', function factory() {
        return {
            template: '<i class="item__action"></i>',
            replace: true,
            restrict: 'E'
        };
    })
    .directive('sendMessage', function (request) {
        return {
            transclude: true,
            require: '^item',
            restrict: 'A',
            scope: {
                uid: '=',
                chatId: '='
            },
            link: function(scope, element, attrs, itemCtrl) {
                element.bind('click', function () {
                    scope.$apply(function () {
                        itemCtrl.showReply(function (message) {
                            var params = {
                                message: message
                            };

                            if (scope.chatId) {
                                params.chatId = scope.chatId;
                            } else {
                                params.uid = scope.uid;
                            }

                            request.api({
                                code: 'return API.messages.send(' + JSON.stringify(params) + ');'
                            });
                        }, 'Private message');
                    });
                });
            }
        };
    })
    .filter('isObject', function () {
        return function (input) {
            return angular.isObject(input);
        };
    });


