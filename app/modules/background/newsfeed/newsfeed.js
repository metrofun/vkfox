angular.module(
    'newsfeed',
    ['mediator', 'request', 'likes']
).run(function (Request, Mediator) {
    var MAX_ITEMS_COUNT = 50,
        UPDATE_PERIOD = 1000,

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
        ItemsColl = Backbone.Collection.extend({
            model: Backbone.Model.extend({
                parse: function (item) {
                    item.id = [
                        item.source_id,
                        item.post_id,
                        item.type
                    ].join(':');
                    return item;
                }
            })
        }),
        groupItemsColl = new ItemsColl(),
        friendItemsColl = new ItemsColl(),
        rotateId, readyDeferred, autoUpdateParams;

    function fetchNewsfeed() {
        Request.api({code: [
            'return {newsfeed: API.newsfeed.get(',
            JSON.stringify(autoUpdateParams),
            '), time: API.utils.getServerTime()};'
        ].join('')}).done(function (response) {
            var newsfeed = response.newsfeed;

            // TODO remove debug
            if (autoUpdateParams.start_time === response.time) {
                console.warn('duplicate requests for newsfeed');
            }
            autoUpdateParams.start_time = response.time;
            autoUpdateParams.from = newsfeed.new_from;

            profilesColl
                .add(newsfeed.profiles, {parse: true})
                .add(newsfeed.groups, {parse: true});

            discardOddWallPhotos(newsfeed.items).forEach(processRawItem);

            // try to remove old items, if new were inserted
            if (newsfeed.items.length) {
                freeSpace();
            }
            rotateId = setTimeout(fetchNewsfeed, UPDATE_PERIOD);
            readyDeferred.resolve();
        });
    }

    /**
     * Generates unique id for every item,
     * or merges new item into existing one with the same id;
     * For example new wall_photos will be merged with existing for the user
     */
    function processRawItem(item) {
        var collection, propertyName, collisionItem,
            typeToPropertyMap = {
                'wall_photo': 'photos',
                'photo': 'photos',
                'photo_tag': 'photo_tags',
                'note': 'notes',
                'friend': 'friends'
            };

        item.id = [item.source_id, item.post_id, item.type].join(':');

        if (item.source_id > 0) {
            collisionItem = friendItemsColl.get(item.id);
            friendItemsColl.remove(collisionItem);
        } else {
            collisionItem = groupItemsColl.get(item.id);
            groupItemsColl.remove(collisionItem);
        }

        if (collisionItem) {
            collisionItem = collisionItem.toJSON();

            if (collisionItem.type !== 'post') {
                // type "photo" item has "photos" property; note - notes etc
                propertyName = typeToPropertyMap[collisionItem.type];
                collection = item[propertyName].slice(1).concat(
                    collisionItem[propertyName].slice(1)
                );
                item[propertyName] = [collection.length].concat(collection);
            }
        }

        if (item.source_id > 0) {
            friendItemsColl.add(item, {at: 0});
        } else {
            groupItemsColl.add(item, {at: 0});
        }
    }
    /**
     * API returns 'wall_photo' item for every post item with photo.
     *
     * @param {Array} items
     * return {Array} filtered array of items
     */
    function discardOddWallPhotos(items) {
        return items.filter(function (item) {
            var wallPhotos, attachedPhotos;

            if (item.type === 'wall_photo') {
                wallPhotos = item.photos.slice(1);
                // collect all attachments from source_id's posts
                attachedPhotos = _.where(items, {
                    type: 'post',
                    source_id: item.source_id
                }).reduce(function (attachedPhotos, post) {
                    if (post.attachments) {
                        attachedPhotos = attachedPhotos.concat(
                            _.where(post.attachments, {
                                type: 'photo'
                            }).map(function (attachment) {
                                return attachment.photo;
                            })
                        );
                    }
                    return attachedPhotos;
                }, []);
                //exclude attachedPhotos from wallPhotos
                wallPhotos = wallPhotos.filter(function (wallPhoto) {
                    return !(_.findWhere(attachedPhotos, {
                        pid: wallPhoto.pid
                    }));
                });
                item.photos = [wallPhotos.length].concat(wallPhotos);
                return  wallPhotos.length;
            }
            return true;
        });
    }
    /**
     * Deletes items, when there are more then MAX_ITEMS_COUNT.
     * Also removes unnecessary profiles after that
     */
    function freeSpace() {
        var required_uids;

        if (friendItemsColl.size() > MAX_ITEMS_COUNT || groupItemsColl.size() > MAX_ITEMS_COUNT) {
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
        }
    }
    /**
     * Initialize all variables
     */
    function initialize() {
        if (!readyDeferred || readyDeferred.state() === 'resolved') {
            if (readyDeferred) {
                readyDeferred.reject();
            }
            readyDeferred = jQuery.Deferred();
        }
        readyDeferred.then(function () {
            Mediator.pub('newsfeed:friends', {
                profiles: profilesColl.toJSON(),
                items: friendItemsColl.toJSON()
            });
            Mediator.pub('newsfeed:groups', {
                profiles: profilesColl.toJSON(),
                items: groupItemsColl.toJSON()
            });
        });

        autoUpdateParams = {
            count: MAX_ITEMS_COUNT
        };
        profilesColl.reset();
        groupItemsColl.reset();
        friendItemsColl.reset();
        clearTimeout(rotateId);
    }
    initialize();

    // entry point
    Mediator.sub('auth:success', function () {
        initialize();
        fetchNewsfeed();
    });

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
