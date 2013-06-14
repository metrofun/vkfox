angular.module('chat', ['request', 'item'])
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
        $scope.reply = {};

        $scope.replyDialog = function () {
            $scope.reply = {
                visible: !$scope.reply.visible,
                onSend: function (message) {
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
                },
                placeHolder: ''
            };
        }

        $scope.chatItem = {actions: [
            {
                class: 'icon-share-alt',
                onClick: $scope.replyDialog
            }
        ]};
        if (!$scope.dialog.chat_id) {
            $scope.chatItem.actions.push({
                class: 'icon-comment',
                onClick: function () {
                    $scope.chatItem.showReply = !$scope.chatItem.showReply;
                    console.log(arguments);
                }
            });
        }
    });
