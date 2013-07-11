angular.module('news', ['mediator'])
    .controller('NewsController', function ($scope, $routeParams) {
        $scope.tabs = [
            {
                href: '/news/my',
                text: 'My'
            },
            {
                href: '/news/friends',
                text: 'Friends'
            },
            {
                href: '/news/groups',
                text: 'Groups'
            }
        ];

        $scope.activeTab = $routeParams.tab;
    })
    .controller('MyNewsController', function ($scope, Mediator) {
        Mediator.pub('feedbacks:data:get');
        Mediator.sub('feedbacks:data', function (data) {
            $scope.$apply(function () {
                $scope.data = data;

                if (data.items && data.items.length) {
                    data.items.forEach(function (item) {
                        var comment, parent = item.parent, type;

                        switch (item.type) {
                        case 'wall':
                        case 'post':
                            if (parent.comments.can_post) {
                                comment = {
                                    ownerId: parent.owner_id,
                                    id: parent.id,
                                    type: 'post'
                                };
                            }
                            break;
                        case 'comment':
                            if (parent.post && parent.post.comments.can_post) {
                                comment = {
                                    ownerId: parent.post.from_id,
                                    id: parent.post.id,
                                    replyTo: item.parent.id,
                                    type: 'post'
                                };
                            } else if (parent.topic && !parent.topic.is_closed) {
                                comment = {
                                    ownerId: parent.topic.owner_id,
                                    id: parent.topic.tid,
                                    type: 'topic'
                                };
                            } else {
                                if (parent.photo) {
                                    type = 'photo';
                                } else if (parent.video) {
                                    type = 'video';
                                }
                                if (type) {
                                    comment = {
                                        ownerId: parent[type].owner_id,
                                        id: parent[type].id,
                                        type: type
                                    };
                                }
                            }
                            break;
                        case 'topic':
                            comment = {
                                ownerId: parent.owner_id,
                                id: parent.id,
                                type: 'topic'
                            };
                            break;
                        case 'photo':
                            comment = {
                                ownerId: parent.owner_id,
                                id: parent.pid,
                                type: 'photo'
                            };
                            break;
                        case 'video':
                            comment = {
                                ownerId: parent.owner_id,
                                id: parent.id,
                                type: 'video'
                            };
                            break;
                        }
                        item.comment = comment;
                    });
                }
            });
        });
    })
    .controller('FriendNewsController', function ($scope, Mediator) {
        Mediator.pub('newsfeed:friends:get');
        Mediator.sub('newsfeed:friends', function (data) {
            $scope.$apply(function () {
                $scope.data = data;
            });
        });
    })
    .controller('GroupNewsController', function ($scope, Mediator) {
        Mediator.pub('newsfeed:groups:get');
        Mediator.sub('newsfeed:groups', function (data) {
            $scope.$apply(function () {
                $scope.data = data;
            });
        });
    });
