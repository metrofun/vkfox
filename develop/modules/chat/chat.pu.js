var _ = require('underscore')._,
    Backbone = require('backbone'),
    $ = require('zepto'),
    Vow = require('vow'),
    Request = require('request/request.js'),
    Mediator = require('mediator/mediator.js');

require('navigation/navigation.pu.js');
require('item-list/item-list.pu.js');
require('item/item.pu.js');
require('angular').module('app')
    .factory('Chat', function () {
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
            getHistory: function (dialog, offset) {
                var params = {
                    offset: offset,
                    count: 5
                };
                if (dialog.chat_active) {
                    params.chat_id = dialog.chat_id;
                } else {
                    params.user_id = dialog.uid;
                }
                return Request.api({
                    code: 'return  API.messages.getHistory(' + JSON.stringify(params) + ');'
                }).then(function (messages) {
                    if (dialog.chat_active) {
                        //after fetching of news profiles,
                        //we must make sure that we have
                        //required profile objects
                        return require('users/users.pu.js')
                            .getProfilesById(messages.slice(1).map(function (message) {
                                return message.uid;
                            })).then(function (profiles) {
                                return {messages: messages, profiles: profiles};
                            });
                    } else {
                        return Vow.fulfill({messages: messages, profiles: []});
                    }
                });
            }
        };
    })
    .controller('ChatCtrl', function ($scope) {
        Mediator.pub('chat:data:get');
        Mediator.sub('chat:data', function (data) {
            $scope.$apply(function () {
                $scope.dialogs = data.dialogs;
                $scope.profilesColl = new Backbone.Collection(data.profiles, {
                    model: Backbone.Model.extend({
                        idAttribute: 'uid'
                    })
                });
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
            Chat.getHistory(dialog, dialog.messages.length).then(function (data) {
                console.log(data);
                var messages = data.messages;
                $scope.profilesColl.add(data.profiles);
                $scope.$apply(function () {
                    // TODO else hide button - show history
                    if (messages.length > 1) {
                        //remove first item, which contains count
                        data.messages.shift();
                        [].unshift.apply(dialog.messages, messages.reverse());
                    }
                });
            }).done();
        };
        $scope.unreadHandler = function (event) {
            if ($scope.out) {
                //show tooltip
                $(event.currentTarget).data('tooltip').toggle();
            } else {
                Chat.markAsRead($scope.dialog.messages);
                $(event.currentTarget).data('tooltip').hide();
            }
        };
    });
