define(['backbone', 'underscore', 'request/request', 'mediator/mediator'],
    function (Backbone, _, request, Mediator, data) {
        return Backbone.Model.extend({
            defaults: {
                friends: new Backbone.Collection()
            },
            initialize: function () {
                request.api({
                    code: 'return API.friends.get({ fields : "photo,sex,nickname,lists" });'
                }).done(function (response) {
                    this.get('friends').add(response);
                }.bind(this));

                Mediator.sub('friends:view', function () {
                    Mediator.pub('friends:data', this.toJSON());
                }.bind(this));
            }
        });
    }
);
