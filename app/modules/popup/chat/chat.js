angular.module('chat', ['item', 'mediator', 'request'])
    .controller('ChatCtrl', function ($scope, Mediator, Request) {
        $scope.markAsRead = function (messages) {
            Request.api({code: 'return API.messages.markAsRead({mids: ['
                + _.pluck(messages, 'id') + ']});'});
        };

        Mediator.pub('chat:data:get');
        Mediator.sub('chat:data', function (dialogs) {
            $scope.$apply(function () {
                $scope.data = dialogs.map(function (dialog) {
                    var messageAuthorId = dialog.messages[0].uid, result = {};

                    if ((dialog.chat_id || dialog.uid !== messageAuthorId)) {
                        result.author = _(dialog.profiles).findWhere({
                            id: messageAuthorId
                        });
                        console.log(result.author);
                    }
                    if (dialog.chat_id) {
                        result.owners = dialog.profiles;
                    } else {
                        result.owners = _(dialog.profiles).findWhere({
                            id: dialog.uid
                        });
                    }

                    result.messages = dialog.messages;
                    result.chat_id = dialog.chat_id;
                    result.uid = dialog.uid;
                    result.isUnread = dialog.messages[
                        dialog.messages.length - 1
                    ].read_state === 0;

                    return result;
                });
            });
        }.bind(this));
    });
