angular.module('chat', ['item', 'mediator', 'request', 'rectify'])
    .controller('ChatCtrl', function ($scope, Mediator, Request) {
        $scope.markAsRead = function (messages) {
            Request.api({code: 'return API.messages.markAsRead({mids: ['
                + _.pluck(messages, 'mid') + ']});'});
        };

        Mediator.pub('chat:data:get');
        Mediator.sub('chat:data', function (data) {
            $scope.$apply(function () {
                $scope.data = data.dialogs.map(function (dialog) {
                    var firstMessage = dialog.messages[0], result = {};

                    if (dialog.messages[0].out) {
                        // find logined user profile
                        result.author = _(data.profiles).findWhere({
                            isSelf: true
                        });
                    } else if (dialog.chat_id) {
                        result.author = _(data.profiles).findWhere({
                            uid: firstMessage.uid
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

                    result.id = dialog.id;
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
