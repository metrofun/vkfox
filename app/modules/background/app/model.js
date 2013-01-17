define([
    'backbone',
    'auth/model',
    'chat/model',
    'newsfeed/model',
    'feedback/model',
    'users/model',
    'longpoll/model',
    'mediator/mediator',
], function (
    Backbone,
    AuthModel,
    ChatModel,
    NewsfeedModel,
    FeedbackModel,
    UsersModel,
    LongpollModel,
    Mediator
) {
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
            longpollModel;

            Mediator.sub('app:view', function () {
                Mediator.pub('app:data', this.toJSON());
            }.bind(this));

            Mediator.sub('auth:success', function (authData) {
                usersModel = new UsersModel();
                // newsfeedModel = new NewsfeedModel();
                longpollModel = new LongpollModel();
                chatModel = new ChatModel({
                    userId: authData.userId
                });
                // feedbackModel = new FeedbackModel();
            });
        }
    });
});
