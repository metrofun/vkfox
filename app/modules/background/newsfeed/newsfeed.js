angular.module(
    'newsfeed',
    ['mediator', 'request', 'likes']
).run(function (Request, Mediator) {
    var MAX_ITEMS_COUNT = 50,
        UPDATE_PERIOD = 1000,

        readyDeferred = jQuery.Deferred(),
        profilesColl = new (Backbone.Collection.extend({
            model: Backbone.Model.extend({
                parse: function (profile) {
                    if (profile.gid) {
                        profile.id = -profile.gid;
                    } else {
                        profile.id = profile.uid;
                    }
                    return profile;
                }
            })
        }))(),
        groupItemsColl = new Backbone.Collection(),
        friendItemsColl = new Backbone.Collection(),
        autoUpdateParams = {};

    function fetchNewsfeed() {
        var params = _.extend({
            count: MAX_ITEMS_COUNT
        }, autoUpdateParams);

        Request.api({code: [
            'return {newsfeed: API.newsfeed.get(',
            JSON.stringify(params),
            '), time: API.utils.getServerTime()};'
        ].join('')}).done(function (response) {
            var newsfeed = response.newsfeed;

            autoUpdateParams.start_time = response.time;
            autoUpdateParams.from = newsfeed.new_from;

            profilesColl
                .add(newsfeed.profiles, {parse: true})
                .add(newsfeed.groups, {parse: true});

            discardOddWallPhotos(newsfeed.items).forEach(function (item) {
                if (item.source_id > 0) {
                    friendItemsColl.add(item, {at: 0});
                } else {
                    // console.log(item);
                    groupItemsColl.add(item, {at: 0});
                }
            });

            // try to remove old items, if new were inserted
            if (newsfeed.items.length) {
                freeSpace();
            }
            setTimeout(fetchNewsfeed, UPDATE_PERIOD);
            readyDeferred.resolve();
        });
    }

    /**
     * API returns 'wall_photo' item for every post item with photo.
     *
     * @param {Array} items
     * return {Array} filtered array of items
     */
    function discardOddWallPhotos(items) {
        return items.filter(function (item) {
            if (item.type === 'wall_photo') {
                return !(_.findWhere(items, {
                    type: 'post',
                    date: item.date,
                    source_id: item.source_id
                }));
            }
            return true;
        });
    }
    /**
     * Deletes items, when there a re more then MAX_ITEMS_COUNT.
     * Also removes unnecessary profiles after that
     */
    function freeSpace() {
        var required_uids;

        if (true || friendItemsColl.size() > MAX_ITEMS_COUNT || groupItemsColl.size() > MAX_ITEMS_COUNT) {
            // slice items
            friendItemsColl.reset(friendItemsColl.slice(0, MAX_ITEMS_COUNT));
            groupItemsColl.reset(groupItemsColl.slice(0, MAX_ITEMS_COUNT));


            // gather required profiles' ids from new friends
            required_uids = _(friendItemsColl.where({
                type: 'friend'
            }).map(function (model) {
                // first element contains quantity
                return model.get('friends').slice(1);
            })).chain().flatten().pluck('uid').value();

            // gather required profiles from source_ids
            required_uids = _(required_uids.concat(
                groupItemsColl.pluck('source_id'),
                friendItemsColl.pluck('source_id')
            )).uniq();

            profilesColl.reset(profilesColl.filter(function (model) {
                return required_uids.indexOf(model.get('id')) !== -1;
            }));
            console.log(profilesColl);
        }
    }

    fetchNewsfeed();

    // Subscribe to events from popup
    Mediator.sub('newsfeed:friends:get', function () {
        readyDeferred.then(function () {
            Mediator.pub('newsfeed:friends', {
                profiles: profilesColl.toJSON(),
                items: friendItemsColl.toJSON()
            });
        });
    });

    Mediator.sub('newsfeed:groups:get', function () {
        readyDeferred.then(function () {
            Mediator.pub('newsfeed:groups', {
                profiles: profilesColl.toJSON(),
                items: groupItemsColl.toJSON()
            });
        });
    });

    readyDeferred.then(function () {
        Mediator.sub('likes:changed', function (params) {
            var model, whereClause = {
                type: params.type,
                source_id: params.owner_id,
                post_id: params.item_id
            };
            if (params.owner_id > 0) {
                model = friendItemsColl.findWhere(whereClause);
            } else {
                model = groupItemsColl.findWhere(whereClause);
            }
            if (model) {
                model.set('likes', params.likes);
            }
        });
    });

    readyDeferred.then(function () {
        groupItemsColl.on('change add', function () {
            Mediator.pub('newsfeed:groups', {
                profiles: profilesColl.toJSON(),
                items: groupItemsColl.toJSON()
            });
        });
        friendItemsColl.on('change add', function () {
            Mediator.pub('newsfeed:friends', {
                profiles: profilesColl.toJSON(),
                items: friendItemsColl.toJSON()
            });
        });
    });
});
