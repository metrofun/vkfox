angular.module('buddies', ['users', 'request', 'mediator']).run(function (Users, Request, Mediator) {
    var readyDeferred = jQuery.Deferred(),
        buddiesColl = new (Backbone.Collection.extend({
            model: Backbone.Model.extend({
                idAttribute: 'uid'
            }),
            comparator: function (buddie) {
                if (buddie.get('isFave')) {
                    return -1;
                } else {
                    return buddie.get('originalIndex') || 0;
                }
            }
        }))();

    /**
     * Returns profiles from bookmarks,
     * and sets "isFave=true" on profile object
     *
     * @returns [jQuery.Deferred]
     */
    function getFavouriteUsers() {
        return Request.api({
            code: 'return API.fave.getUsers()'
        }).then(function (response) {
            return Users.getProfilesById(
                _.pluck(response.slice(1),
                'id'
            )).then(function (profiles) {
                profiles.forEach(function (profile) {
                    profile.isFave = true;
                });
                return profiles;
            });
        });
    }

    jQuery.when(
        getFavouriteUsers(),
        Users.getFriendsProfiles()
    ).then(function (favourites, friends) {
        buddiesColl.add(favourites);
        buddiesColl.add(friends);
        readyDeferred.resolve();
    });

    Mediator.sub('buddies:data:get', function () {
        readyDeferred.then(function () {
            Mediator.pub('buddies:data', buddiesColl.toJSON());
        });
    });
});
