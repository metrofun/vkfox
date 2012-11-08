define([
    'backbone',
    'underscore',
    'request/request',
    'mediator/mediator'
], function (Backbone, _, request, Mediator) {
    return Backbone.Model.extend({
        defaults: {
            users: new (Backbone.Collection.extend({
                model: Backbone.Model.extend({
                    idAttribute: 'uid'
                })
            }))()
        },
        initialize: function () {
            Mediator.sub('users:get', this.onGet.bind(this));
        },
        onGet: function (uids) {
            var newUids = _.without(uids, this.get('users').pluck('uid'));

            if (newUids.length) {
                request.api({
                    code: 'return API.users.get({uids: "' + newUids.join() + '", fields : "photo,sex,nickname,lists"})'
                }).done(function (response) {
                    if (response && response.length) {
                        this.get('users').add(response);
                        this.publishData(uids);
                    }
                }.bind(this));
            } else {
                this.publishData(uids);
            }
        },
        publishData: function (uids) {
            var data = uids.map(function (uid) {
                return this.get('users').get(uid);
            }.bind(this));

            Mediator.pub('users:' + uids.join(), data);
        }
    });
});
