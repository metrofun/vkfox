angular.module('chat', ['request'])
    .controller('ChatCtrl', function ($scope, mediator) {
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
                    result.chat_id = dialog.chat_id;
                    result.uid = dialog.uid;

                    return result;
                });
            });
        }.bind(this));
    })
    .controller('ChatItemCtrl', function ($scope, request) {
        $scope.onReply = function (message) {
            alert(message);
        };

        $scope.itemData = {actions: [
            {
                class: 'icon-envelope',
                onClick: function () {
                    $scope.itemData.showReply = !$scope.itemData.showReply;

                    $scope.onReply = function (message) {
                        var params = {
                                message: jQuery.trim(message)
                            }, dialog = $scope.dialog;

                        if (dialog.chat_id) {
                            params.chat_id = dialog.chat_id;
                        } else {
                            params.uid = dialog.uid;
                        }

                        request.api({
                            code: 'return API.messages.send(' + JSON.stringify(params) + ');'
                        });
                        console.log(params);
                    }
                }
            }
        ]};
    });
