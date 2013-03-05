define([
    'backbone',
    'auth/model',
    'chat/model',
    'newsfeed/model',
    'feedback/model',
    'users/model',
    'longpoll/model',
    'buddies/model',
    'mediator/mediator',
], function (
    Backbone,
    AuthModel,
    ChatModel,
    NewsfeedModel,
    FeedbackModel,
    UsersModel,
    BuddiesModel,
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
            longpollModel, buddiesModel;

            Mediator.sub('app:view', function () {
                Mediator.pub('app:data', this.toJSON());
            }.bind(this));

            Mediator.sub('auth:success', function (authData) {
                usersModel = new UsersModel();
                longpollModel = new LongpollModel();
                chatModel = new ChatModel({
                    userId: authData.userId
                });
                buddiesModel = new BuddiesModel();
                // newsfeedModel = new NewsfeedModel();
                feedbackModel = new FeedbackModel();
            });
        }
    });
});
