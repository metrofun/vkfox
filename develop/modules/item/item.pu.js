var Mediator = require('mediator/mediator.js'),
    Request = require('request/request.js'),
    I18N = require('i18n/i18n.pu.js');

require('angularKeypress');
require('filters/filters.pu.js');
require('angular').module('app')
    .directive('item', function () {
        return {
            controller: function ($scope) {
                $scope.reply = {
                    visible: false
                };
                if (!Array.isArray($scope.owners)) {
                    if ($scope.owners.uid > 0) {
                        $scope.anchor = '/id' + $scope.owners.uid;
                    } else {
                        $scope.anchor = '/club' + $scope.owners.gid;
                    }
                }

                /**
                 * Show block with text message input
                 *
                 * @param {Function} onSend
                 * @param {String} placeholder
                 */
                this.showReply = function (onSend, placeholder) {
                    $scope.reply.onSend = onSend;
                    $scope.reply.placeholder = placeholder;
                    $scope.reply.visible = !$scope.reply.visible;
                };

                $scope.onReply = function (message) {
                    if (message.length > 1) {
                        $scope.reply.visible = false;
                        $scope.reply.onSend(message);
                    }
                };
            },
            templateUrl: '/modules/item/item.tmpl.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                owners: '=',
                description: '@?',
                reply: '=?',
                'class': '@'
            }
        };
    })
    .directive('itemAttachment', function () {
        return {
            templateUrl: '/modules/item/attachment.tmpl.html',
            replace: true,
            restrict: 'E',
            scope: {
                // TODO why @?
                type: '@',
                data: '='
            }
        };
    })
    .directive('itemActions', function () {
        return {
            template: '<div class="item__actions" ng-transclude></div>',
            replace: true,
            transclude: true,
            restrict: 'E'
        };
    })
    .directive('itemAction', function () {
        return {
            template: '<i class="item__action"></i>',
            replace: true,
            restrict: 'E'
        };
    })
    /**
     * Sends message on click and marks everything as read
     */
    .directive('itemSendMessage', function () {
        var title =  I18N.get('Private message');

        return {
            transclude: true,
            require: '^item',
            restrict: 'A',
            scope: {
                uid: '=',
                chatId: '=?'
            },
            controller: function ($element, $transclude) {
                $transclude(function (clone) {
                    $element.append(clone);
                });
            },
            compile: function (tElement, tAttrs) {
                if (tAttrs.title === undefined) {
                    tAttrs.$set('title', title);
                }
                return function (scope, element, attrs, itemCtrl) {
                    element.bind('click', function () {
                        scope.$apply(function () {
                            itemCtrl.showReply(function (message) {
                                var params = {
                                    message: message.trim()
                                };

                                if (scope.chatId) {
                                    params.chat_id = scope.chatId;
                                } else {
                                    params.uid = scope.uid;
                                }

                                Request.api({
                                    code: 'return API.messages.send(' + JSON.stringify(params) + ');'
                                });
                                // mark messages if not from chat
                                if (params.uid) {
                                    Request.api({
                                        code: 'return API.messages.markAsRead({message_ids: API.messages.getHistory({user_id:'
                                        + params.uid + '})@.mid});'
                                    });
                                }
                            }, title);
                        });
                    });
                };
            }
        };
    })
    .directive('itemPostWall', function () {
        var title =  I18N.get('Wall post');

        return {
            transclude: true,
            require: '^item',
            restrict: 'A',
            scope: {
                uid: '='
            },
            controller: function ($element, $transclude) {
                $transclude(function (clone) {
                    $element.append(clone);
                });
            },
            compile: function (tElement, tAttrs) {
                tAttrs.$set('title', title);
                return function (scope, element, attrs, itemCtrl) {
                    element.bind('click', function () {
                        scope.$apply(function () {
                            itemCtrl.showReply(function (message) {
                                var params = {
                                    message: message.trim(),
                                    owner_id: scope.uid
                                };

                                Request.api({
                                    code: 'return API.wall.post(' + JSON.stringify(params) + ');'
                                });
                            }, title);
                        });
                    });
                };
            }
        };
    })
    .directive('itemActionLike', function () {
        var title =  I18N.get('Like');

        return {
            templateUrl: '/modules/item/action-like.tmpl.html',
            restrict: 'E',
            replace: true,
            scope: {
                // Default type is 'post'
                type: '=?',
                ownerId: '=',
                itemId: '=',
                likes: '='
            },
            compile: function (tElement, tAttrs) {
                tAttrs.$set('title', title);

                return function (scope, element) {
                    element.bind('click', function () {
                        Mediator.pub('likes:change', {
                            action: scope.likes.user_likes ? 'delete':'add',
                            type: scope.type || 'post',
                            owner_id: scope.ownerId,
                            item_id: scope.itemId
                        });
                    });
                };
            }
        };
    })
    .directive('itemActionComment', function () {
        var title =  I18N.get('Comment');

        return {
            require: '^item',
            template: '<i class="item__action icon-comment"></i>',
            restrict: 'E',
            replace: true,
            scope: {
                type: '=?',
                ownerId: '=?',
                id: '=?',
                replyTo: '=?',
                text: '='
            },
            compile: function (tElement, tAttrs) {
                tAttrs.$set('title', title);

                function onReply(scope, message) {
                    var params = {}, method;

                    switch (scope.type) {
                    case 'wall':
                    case 'post':
                        params.owner_id = scope.ownerId;
                        params.post_id = scope.id;
                        method = 'wall.addComment';
                        params.text = message;
                        if (scope.replyTo) {
                            params.reply_to_cid = scope.replyTo;
                        }
                        break;
                    case 'topic':
                        params.gid = Math.abs(scope.ownerId);
                        params.tid = scope.id;
                        params.text = message;
                        method = 'board.addComment';
                        break;
                    case 'photo':
                        params.oid = scope.ownerId;
                        params.pid = scope.id;
                        params.message = message;
                        method = 'photos.createComment';
                        break;
                    case 'video':
                        params.owner_id = scope.ownerId;
                        params.video_id = scope.id;
                        params.message = message;
                        method = 'video.createComment';
                        break;
                    }

                    if (method) {
                        Request.api({
                            code: 'return API.' + method + '(' + JSON.stringify(params) + ');'
                        });
                    }
                }

                return function (scope, element, attrs, itemCtrl) {
                    element.bind('click', function () {
                        scope.$apply(function () {
                            itemCtrl.showReply(onReply.bind(null, scope), title);
                        });
                    });
                };
            }
        };
    });
