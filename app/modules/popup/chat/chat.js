angular.module('chat', ['item', 'mediator', 'request', 'ngSanitize'])
    .controller('ChatCtrl', function ($scope, Mediator, Request) {
        $scope.markAsRead = function (messages) {
            Request.api({code: 'return API.messages.markAsRead({mids: ['
                + _.pluck(messages, 'mid') + ']});'});
        };

        Mediator.pub('chat:data:get');
        Mediator.sub('chat:data', function (data) {
            $scope.$apply(function () {
                $scope.data = data.dialogs.map(function (dialog) {
                    var messageAuthorId = dialog.messages[0].uid, result = {};

                    if ((dialog.chat_id || dialog.uid !== messageAuthorId)) {
                        result.author = _(data.profiles).findWhere({
                            uid: messageAuthorId
                        });
                    }
                    if (dialog.chat_id) {
                        result.owners = dialog.chat_active.map(function (uid) {
                            return _(data.profiles).findWhere({uid: uid});
                        });
                    } else {
                        result.owners = _(data.profiles).findWhere({
                            uid: dialog.uid
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
