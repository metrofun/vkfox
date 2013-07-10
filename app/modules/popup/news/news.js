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
                        var comment;
                        switch (item.type) {
                        case 'wall':
                        case 'post':
                            comment = {
                                ownerId: item.parent.owner_id,
                                id: item.parent.id,
                                type: 'post'
                            };
                            break;
                        case 'comment':
                            if (item.parent.post) {
                                comment = {
                                    ownerId: item.parent.post.from_id,
                                    id: item.parent.post.id,
                                    replyTo: item.parent.id,
                                    type: 'post'
                                };
                            } else if (item.parent.topic) {
                                comment = {
                                    ownerId: item.parent.topic.owner_id,
                                    id: item.parent.topic.tid,
                                    replyTo: item.parent.id,
                                    type: 'topic'
                                };
                            } else {
                                throw 'not implemented';
                            }
                            break;
                        case 'topic':
                            comment = {
                                ownerId: item.parent.owner_id,
                                id: item.parent.id,
                                type: 'topic'
                            };
                            break;
                        case 'photo':
                            comment = {
                                ownerId: item.parent.owner_id,
                                id: item.parent.pid,
                                type: 'photo'
                            };
                            break;
                        case 'video':
                            comment = {
                                ownerId: item.parent.owner_id,
                                id: item.parent.post.id,
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
