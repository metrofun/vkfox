angular.module('app', ['router', 'item'])
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
                href: '/updates',
                name: 'Updates'
            }
        ];
    })
    .controller('buddiesCtrl', function ($scope, mediator) {
        mediator.pub('buddies:data:get');
        mediator.sub('buddies:data', function (data) {
            $scope.$apply(function () {
                $scope.data = data;
            });
        }.bind(this));
    })
    .controller('chatCtrl', function ($scope, mediator) {
        mediator.pub('chat:data:get');
        mediator.sub('chat:data', function (data) {
            $scope.$apply(function () {
                $scope.data = data.dialogs;
            });
        }.bind(this));
    })
    .controller('feedCtrl', function ($scope) {
        var dialog = $scope.dialog,
            profile,
            messageAuthorId = dialog.messages[0].uid;

        if (dialog.chat_id) {
        } else {
            profile = _(dialog.profiles).findWhere({
                uid: dialog.uid
            });

            $scope.photo = profile.photo;
            $scope.title = profile.first_name + ' ' + profile.last_name;
        }

        if ((dialog.chat_id || dialog.uid !== messageAuthorId)) {
            profile = _(dialog.profiles).findWhere({
                uid: messageAuthorId
            });

            $scope.messageAuthor = profile.first_name + ' ' + profile.last_name;
        }
    });
