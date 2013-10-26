angular.module('chat', ['item', 'mediator', 'request', 'rectify'])
    .controller('ChatCtrl', function ($scope, Mediator, Request, $filter) {
        var MARK_AS_READ = $filter('i18n')('Mark as read'),
            YOUR_MESSAGE_WASNT_READ = $filter('i18n')('Your message wasn\'t read');

        function markAsRead(messages) {
            Request.api({code: 'return API.messages.markAsRead({mids: ['
                + _.pluck(messages, 'mid') + ']});'});
        }

        function showTooltip(messages, event) {
            jQuery(event.currentTarget).data('tooltip').toggle();
        }

        Mediator.pub('chat:data:get');
        Mediator.sub('chat:data', function (data) {
            $scope.$apply(function () {
                $scope.data = data.dialogs.map(function (dialog) {
                    var firstMessage = dialog.messages[0], result = {},
                        selfProfile = _(data.profiles).findWhere({
                            isSelf: true
                        });

                    if (dialog.messages[0].out) {
                        // find logined user profile
                        result.author = selfProfile;
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

                    if (result.isUnread) {
                        if (result.author === selfProfile) {
                            result.unreadTooltip = YOUR_MESSAGE_WASNT_READ;
                            result.unreadHandler = showTooltip;
                        } else {
                            result.unreadTooltip = MARK_AS_READ;
                            result.unreadHandler = markAsRead;
                        }
                    }

                    return result;
                });
            });
        }.bind(this));
    });
