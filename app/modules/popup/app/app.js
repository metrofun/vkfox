angular.module('app', ['router', 'item', 'filters', 'news'])
    .controller('navigationCtrl', function ($scope, $location) {
        $scope.locationPath = $location.path();
        $scope.location = $location;
        $scope.$watch('location.path()', function (path) {
            $scope.locationPath = path;
        });
        $scope.tabs = [
            {
                href: '/chat',
                name: 'Chat'
            },
            {
                href: '/buddies',
                name: 'Buddies'
            },
            {
                href: '/news',
                name: 'News'
            }
        ];
    })
    .controller('buddiesCtrl', function ($scope, mediator) {
        var PRELOAD_ITEMS = 15;

        mediator.pub('buddies:data:get');
        mediator.sub('buddies:data', function (data) {
            $scope.$apply(function () {
                $scope.data = data.slice(0, PRELOAD_ITEMS);
            });
        }.bind(this));
    })
    .controller('chatCtrl', function ($scope, mediator) {
        mediator.pub('chat:data:get');
        mediator.sub('chat:data', function (data) {
            $scope.$apply(function () {
                $scope.data = data.dialogs.map(function (dialog) {
                    var messageAuthorId = dialog.messages[0].uid, result = {};

                    if ((dialog.chat_id || dialog.uid !== messageAuthorId)) {
                        result.author = _(dialog.profiles).findWhere({
                            uid: messageAuthorId
                        });
                    }
                    if (dialog.chat_id) {
                        result.owners = dialog.profiles;
                    } else {
                        result.owners = _(dialog.profiles).findWhere({
                            uid: dialog.uid
                        });
                    }

                    result.messages = dialog.messages;

                    return result;
                });
            });
        }.bind(this));
    });

