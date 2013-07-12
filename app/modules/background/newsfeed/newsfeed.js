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

        console.log('newsfeed params:', params);
        Request.api({code: [
            'return API.newsfeed.get(',
            JSON.stringify(params),
            ');'
        ].join('')}).done(function (response) {
            autoUpdateParams.offset = response.new_offset;
            autoUpdateParams.from = response.new_from;

            profilesColl
                .add(response.profiles, {parse: true})
                .add(response.groups, {parse: true});

            response.items.forEach(function (item) {
                if (item.source_id > 0) {
                    friendItemsColl.add(item);
                } else {
                    groupItemsColl.add(item);
                }
            });

            setTimeout(fetchNewsfeed, UPDATE_PERIOD);
            readyDeferred.resolve();
        });
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

    groupItemsColl.on('change', function () {
        readyDeferred.then(function () {
            Mediator.pub('newsfeed:groups', {
                profiles: profilesColl.toJSON(),
                items: groupItemsColl.toJSON()
            });
        });
    });
    friendItemsColl.on('change', function () {
        readyDeferred.then(function () {
            Mediator.pub('newsfeed:friends', {
                profiles: profilesColl.toJSON(),
                items: friendItemsColl.toJSON()
            });
        });
    });
});
