define([
    'backbone',
    'auth/model',
    'chat/model',
    'newsfeed/model',
    'feedback/model',
    'users/model',
    'friends/model',
    'request/request',
    'mediator/mediator'
], function (Backbone, AuthModel, ChatModel, NewsfeedModel, FeedbackModel, UsersModel, FriendsModel, request, Mediator) {
    return Backbone.Model.extend({
        //FIXME unimplemented
        attributes: {
            state: 'loading'
        },
        initialize: function () {
            var
            authModel = new AuthModel(),
            newsfeedModel, feedbackModel,
            chatModel, usersModel,
            friendsModel;

            Mediator.sub('app:view', function () {
                Mediator.pub('app:data', this.toJSON());
            }.bind(this));

            Mediator.sub('auth:success', function (authData) {
                newsfeedModel = new NewsfeedModel();
                chatModel = new ChatModel();
                usersModel = new UsersModel();
                feedbackModel = new FeedbackModel();
                friendsModel = new FriendsModel();
            });
        }
    });
});
