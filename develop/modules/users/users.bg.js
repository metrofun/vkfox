var
DROP_PROFILES_INTERVAL = 500,
USERS_GET_DEBOUNCE = 400,

Vow = require('vow'),
Backbone = require('backbone'),
Mediator = require('mediator/mediator.js'),
Request = require('request/request.bg.js'),
_ = require('underscore')._,

inProgress, usersGetQueue, friendsProfilesDefer,
usersColl = new (Backbone.Collection.extend({
    model: Backbone.Model.extend({
        idAttribute: 'uid'
    })
}))(),
dropOldNonFriendsProfiles = _.debounce(function () {
    if (!inProgress) {
        usersColl.remove(usersColl.filter(function (model) {
            return !model.get('isFriend');
        }));
    }
    dropOldNonFriendsProfiles();
}, DROP_PROFILES_INTERVAL),
/**
 * Resolves items from provided queue
 *
 * @param [Array] queue
 */
publishUids = function (queue) {
    var data, queueItem;

    function getProfileById(uid) {
        return _.clone(usersColl.get(Number(uid)));
    }

    while (queue.length) {
        queueItem = queue.pop();
        data = queueItem.uids.map(function (uid) {
            return getProfileById(uid).toJSON();
        });

        queueItem.promise.resolve(data);
    }
},
processGetUsersQueue = _.debounce(function () {
    var processedQueue = usersGetQueue,
    newUids = _.chain(processedQueue).pluck('uids').flatten()
    .unique().difference(usersColl.pluck('id')).value();

    // start new queue
    usersGetQueue = [];

    if (newUids.length) {
        inProgress = true;
        Request.api({
            // TODO limit for uids.length
            code: 'return API.users.get({uids: "' + newUids.join() + '", fields: "online,photo,sex,nickname,lists"})'
        }).then(function (response) {
            if (response && response.length) {
                usersColl.add(response);
                publishUids(processedQueue);
                inProgress = false;
            }
        });
    } else {
        publishUids(processedQueue);
    }
}, USERS_GET_DEBOUNCE);
/**
 * Initialize all variables
 */
function initialize() {
    inProgress = false;
    usersColl.reset();
    usersGetQueue = [];
    friendsProfilesDefer = null;
}
initialize();

Mediator.sub('auth:success', function () {
    initialize();
});

dropOldNonFriendsProfiles();

module.exports = _.extend({
    getFriendsProfiles: function () {
        if (!friendsProfilesDefer) {
            friendsProfilesDefer = Request.api({
                code: 'return API.friends.get({ fields : "photo,sex,nickname,lists", order: "hints" })'
            }).then(function (response) {
                if (response && response.length) {
                    response.forEach(function (friendData) {
                        friendData.isFriend = true;
                    });
                    usersColl.add(response);
                }
                return response;
            }.bind(this));
        }

        return friendsProfilesDefer;
    },
    /**
     * Returns profiles by ids
     * @param [Array<<Number>>] uids Array of user's uds
     *
     * @returns {Vow.promise} Returns promise that will be fulfilled with profiles
     */
    getProfilesById: function (uids) {
        return this.getFriendsProfiles().then(function () {
            var promise = Vow.promise();

            usersGetQueue.push({
                uids: uids,
                promise: promise
            });
            processGetUsersQueue();
            return promise;
        });
    }
}, require('users/name.js'));
