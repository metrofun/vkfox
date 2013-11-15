angular.module('chat', ['item', 'mediator', 'request', 'rectify'])
    .factory('Chat', function (Request) {
        return {
            /**
             * Fold adjoint messages with a common author into a group
             * and return all such groups
             *
             * @param {Array} messages
             * @param {Array} profiles
             *
             * @returns {Array}
             */
            foldMessagesByAuthor: function (messages, profilesColl) {
                var selfProfile = profilesColl.findWhere({isSelf: true}).toJSON();

                return messages.reduce(function (memo, message) {
                    var lastItem = memo[memo.length - 1],
                        author = message.out ? selfProfile : profilesColl.get(message.uid).toJSON();

                    if (lastItem && (author.uid === lastItem.author.uid)) {
                        lastItem.items.push(message);
                    } else {
                        memo.push({
                            items: [message],
                            out: author === selfProfile,
                            author: author
                        });
                    }

                    return memo;
                }, []);
            },
            /**
             * Mark messages as read
             *
             * @param {Array} messages
             */
            markAsRead: function (messages) {
                Request.api({code: 'return API.messages.markAsRead({mids: ['
                    + _.pluck(messages, 'mid') + ']});'});
            },
            getHistory: function (uid, offset) {
                return Request.api({code: 'return  API.messages.getHistory(' + JSON.stringify({
                    uid: uid,
                    offset: offset,
                    count: 5
                }) + ');'});
            }

        };
    })
    .controller('ChatCtrl', function ($scope, Mediator) {
        Mediator.pub('chat:data:get');
        Mediator.sub('chat:data', function (data) {
            $scope.$apply(function () {
                $scope.profilesColl = new Backbone.Collection(data.profiles, {
                    model: Backbone.Model.extend({
                        idAttribute: 'uid'
                    })
                });
                $scope.dialogs = data.dialogs;
            });
        });
        $scope.$on('$destroy', function () {
            Mediator.unsub('chat:data');
        });
    })
    .controller('ChatItemCtrl', function ($scope, Chat) {
        var dialog = $scope.dialog,
            profilesColl = $scope.profilesColl,
            online;

        if (dialog.chat_id) {
            $scope.owners = dialog.chat_active.map(function (uid) {
                return profilesColl.get(uid).toJSON();
            });
        } else {
            $scope.owners = profilesColl.get(dialog.uid).toJSON();

            $scope.$watch(function ($scope) {
                online = $scope.profilesColl.get(dialog.uid).get('online');

                return online;
            }, function () {
                $scope.owners.online = online;
            });
        }

        $scope.$watch(function ($scope) {
            var message = _($scope.dialog.messages).last();
            return [
                $scope.dialog.messages.length,
                message.mid,
                message.read_state
            ].join();
        }, function () {
            var dialog = $scope.dialog;

            $scope.foldedMessages = Chat.foldMessagesByAuthor(dialog.messages, $scope.profilesColl);
            $scope.out = _($scope.foldedMessages).last().author.isSelf;
            $scope.unread = _(dialog.messages).last().read_state === 0;
        });
    })
    .controller('ChatActionsCtrl', function ($scope, Chat) {
        $scope.showHistory = function (dialog) {
            Chat.getHistory(dialog.uid, dialog.messages.length).then(function (messages) {
                $scope.$apply(function () {
                    //remove first item, which contains count
                    messages.shift();
                    [].unshift.apply(dialog.messages, messages.reverse());
                });
            });
        };
        $scope.unreadHandler = function (event) {
            if ($scope.out) {
                //show tooltip
                jQuery(event.currentTarget).data('tooltip').toggle();
            } else {
                Chat.markAsRead($scope.dialog.messages);
                jQuery(event.currentTarget).data('tooltip').hide();
            }
        };
    });
