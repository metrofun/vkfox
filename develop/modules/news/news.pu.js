var Config = require('config/config.js'),
    Mediator = require('mediator/mediator.js');

require('navigation/navigation.pu.js');
require('angular').module('app')
    .factory('News', function () {
        return {
            unsubscribe: function (type, ownerId, itemId) {
                var options = {
                    type: type,
                    owner_id: ownerId,
                    item_id: itemId
                };
                Mediator.pub('feedbacks:unsubscribe', options);
            },
            /**
             * Returns link to the original item on vk.com
             *
             * @param {Object} item
             * @returns {String}
             */
            getSourceLink: function (item) {
                var parent = item.parent;

                switch (item.type) {
                    case 'wall':
                    case 'post':
                    // case 'mention':
                        return Config.VK_BASE + 'wall'
                            + (parent.to_id || parent.source_id) + '_'
                            + (parent.post_id || parent.id) + '?offset=last&scroll=1';
                    case 'comment':
                        // generate link to parent item
                        return ['post', 'topic', 'photo', 'video']
                            .filter(Object.hasOwnProperty, parent)
                            .map(function (type) {
                                var parentLink = this.getSourceLink({type: type, parent: parent[type]});
                                // replace query params
                                return parentLink.replace(/\?[^?]+$/, '?reply=' + item.parent.id);
                            }, this)[0];
                    case 'topic':
                        return Config.VK_BASE + 'topic' + parent.owner_id
                            + '_' + (parent.id || parent.post_id || parent.tid)
                            + '?offset=last&scroll=1';
                    case 'photo':
                        return Config.VK_BASE + 'photo' + parent.owner_id
                            + '_' + (parent.id || parent.pid);
                    case 'video':
                        return Config.VK_BASE + 'video' + parent.owner_id
                            + '_' + (parent.id || parent.vid);
                }
            },
            getCommentsData: function (item) {
                var parent = item.parent;

                switch (item.type) {
                    case 'wall':
                    case 'post':
                    case 'mention':
                        if (parent.comments.can_post) {
                            return {
                                ownerId: parent.source_id || parent.owner_id,
                                id: parent.id || parent.post_id,
                                type: 'post'
                            };
                        }
                        break;
                    case 'comment':
                        if (parent.post && parent.post.comments.can_post) {
                            return {
                                ownerId: parent.post.from_id,
                                id: parent.post.id,
                                replyTo: item.parent.id,
                                type: 'post'
                            };
                        } else if (parent.topic && !parent.topic.is_closed) {
                            return this.getCommentsData({type: 'topic', parent: parent.topic});
                        } else {
                            return ['photo', 'video']
                                .filter(Object.hasOwnProperty, parent)
                                .map(function (type) {
                                    return this.getSourceLink({type: type, parent: parent[type]});
                                }, this)[0];
                        }
                        break;
                    case 'topic':
                        return {
                            ownerId: parent.owner_id,
                            id: parent.id || parent.tid || parent.post_id,
                            type: 'topic'
                        };
                    case 'photo':
                        return {
                            ownerId: parent.owner_id,
                            id: parent.id || parent.pid,
                            type: 'photo'
                        };
                    case 'video':
                        return {
                            ownerId: parent.owner_id,
                            id: parent.id || parent.vid,
                            type: 'video'
                        };
                }
            }
        };
    })
    .controller('NewsController', function ($scope, $routeParams) {
        $scope.subtabs = [
            {
                href: 'news/my',
                text: 'my'
            },
            {
                href: 'news/friends',
                text: 'friends_nominative'
            },
            {
                href: 'news/groups',
                text: 'groups_nominative'
            }
        ];
        $scope.activeSubTab = $routeParams.subtab;
    })
    .controller('MyNewsController', function ($scope) {
        Mediator.pub('feedbacks:data:get');
        Mediator.sub('feedbacks:data', function (data) {
            $scope.$apply(function () {
                $scope.data = data;
            });
        });
        $scope.$on('$destroy', function () {
            Mediator.unsub('feedbacks:data');
        });
    })
    .controller('MyNewsActionsCtrl', function ($scope, News) {
        $scope.unsubscribe = News.unsubscribe;
        $scope.comment = News.getCommentsData($scope.item);
        $scope.open = News.getSourceLink($scope.item);
    })
    .controller('FriendNewsController', function ($scope) {
        Mediator.pub('newsfeed:friends:get');
        Mediator.sub('newsfeed:friends', function (data) {
            $scope.$apply(function () {
                $scope.data = data;
            });
        });
        $scope.$on('$destroy', function () {
            Mediator.unsub('newsfeed:friends');
        });
    })
    .controller('GroupNewsController', function ($scope) {
        Mediator.pub('newsfeed:groups:get');
        Mediator.sub('newsfeed:groups', function (data) {
            $scope.$apply(function () {
                $scope.data = data;
            });
        });
        $scope.$on('$destroy', function () {
            Mediator.unsub('newsfeed:groups');
        });
    });
