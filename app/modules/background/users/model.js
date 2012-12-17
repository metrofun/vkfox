define([
    'backbone',
    'underscore',
    'request/request',
    'mediator/mediator'
], function (Backbone, _, request, Mediator) {
    var DROP_PROFILES_INTERVAL = 30000;

    return Backbone.Model.extend({
        defaults: {
            users: new (Backbone.Collection.extend({
                model: Backbone.Model.extend({
                    idAttribute: 'uid'
                })
            }))()
        },
        initialize: function () {
            this.dropProfiles();
            Mediator.sub('users:get', this.onGet.bind(this));
        },
        // TODO problem when dropped between onGet and response
        dropProfiles: _.debounce(function () {
            this.get('users').reset();
            this.dropProfiles();
        }, DROP_PROFILES_INTERVAL),
        onGet: function (uids) {
            var newUids = _.difference(uids, this.get('users').pluck('uid'));

            if (newUids.length) {
                request.api({
                    // TODO limit for uids.length
                    code: 'return API.users.get({uids: "' + newUids.join() + '", fields : "online, photo,sex,nickname,lists"})'
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
