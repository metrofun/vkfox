angular.module('feedbacks', [
    'mediator',
    'request',
    'likes',
    'profiles-collection',
    'persistent-model',
    'notifications',
    'common'
]).run(function (
    Request,
    Mediator,
    ProfilesCollection,
    NotificationsQueue,
    PersistentModel,
    $filter,
    NOTIFICATIONS_NEWS
) {
    var
    MAX_ITEMS_COUNT = 50,
    MAX_COMMENTS_COUNT = 3,
    UPDATE_PERIOD = 1000, //ms

    readyDeferred = jQuery.Deferred(),
    persistentModel, userId,
    autoUpdateNotificationsParams, autoUpdateCommentsParams,
    profilesColl = new (ProfilesCollection.extend({
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
    fetchFeedbacksDebounced,
    FeedbacksCollection = Backbone.Collection.extend({
        comparator: function (model) {
            return model.get('date');
        }
    }),
    itemsColl = new (Backbone.Collection.extend({
        comparator: function (model) {
            return -model.get('date');
        }
    }))(),
    /**
     * Notifies about current state of module.
     * Has a tiny debounce to make only one publish per event loop
     */
    publishData = _.debounce(function publishData() {
        Mediator.pub('feedbacks:data', {
            profiles: profilesColl.toJSON(),
            items: itemsColl.toJSON()
        });
    }, 0);

    function tryNotification() {
        var itemModel = itemsColl.first(),
            lastFeedback, notificationItem, type, parentType,
            profile, ownerId, gender, title, message, name;

        if (itemModel.has('feedbacks')) { // notification has parent, e.g. comment to post, like to video etc
            lastFeedback = itemModel.get('feedbacks').last(),
            notificationItem = lastFeedback.get('feedback');
            type = lastFeedback.get('type');
            parentType = itemModel.get('type');
        } else { // notification is parent itself, e.g. wall post, friend request etc
            notificationItem = itemModel.get('parent');
            type = itemModel.get('type');
        }

        ownerId = notificationItem.owner_id;

        // Don't show self messages
        if (ownerId !== userId) {
            try {
                profile = profilesColl.get(ownerId).toJSON(),
                name = $filter('name')(profile),
                gender = profile.sex === 1 ? 'female':'male';
            } catch (e) {
                console.log(ownerId, profile, name);
                throw e;
            }

            switch (type) {
            case 'friend_accepted':
                title = name + ' ' + $filter('i18n')('friend request accepted', {
                    GENDER: gender
                });
                break;
            case 'follow':
                title = name + ' ' + $filter('i18n')('started following you', {
                    GENDER: gender
                });
                break;
            case 'mention':
                title = name + ' ' + $filter('i18n')('mentioned you', {
                    GENDER: gender
                });
                message = notificationItem.text;
                break;
            case 'wall':
                title = name + ' ' + $filter('i18n')('posted on your wall', {
                    GENDER: gender
                });
                message = notificationItem.text;
                break;
            case 'like':
                title = name + ' ' + $filter('i18n')('liked your ' + parentType, {
                    GENDER: gender
                });
                break;
            case 'copy':
                title = name + ' ' + $filter('i18n')('shared your ' + parentType, {
                    GENDER: gender
                });
                break;
            case 'comment':
            // 'mention_commentS' type in notifications
            case 'comments':
            case 'reply':
                title = $filter('i18n')('left a comment', {
                    NAME: name,
                    GENDER: gender
                });
                message = notificationItem.text;
                break;
            }

            if (title) {
                NotificationsQueue.push({
                    type: NOTIFICATIONS_NEWS,
                    title: title,
                    message: message,
                    image: profile.photo,
                    noVK: true
                });
            }
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
            persistentModel = new PersistentModel({}, {
                name: ['feedbacks', 'background', userId].join(':')
            });
            persistentModel.on('change:latestFeedbackId', tryNotification);

            publishData();
        });

        autoUpdateNotificationsParams = {
            count: MAX_ITEMS_COUNT
        },
        autoUpdateCommentsParams = {
            last_comments: 1,
            count: MAX_ITEMS_COUNT
        },
        itemsColl.reset();
        profilesColl.reset();
        fetchFeedbacks();
    }
    /**
     * Processes raw comments item and adds it to itemsColl,
     * doesn't sort itemsColl
     *
     * @param {Object} item
     */
    function addRawCommentsItem(item) {
        var parentType = item.type,
            parent = item, itemModel, itemID, lastCommentDate;

        parent.owner_id = Number(parent.from_id || parent.source_id);
        itemID  = generateItemID(parentType, parent);
        if (!(itemModel = itemsColl.get(itemID))) {
            itemModel = createItemModel(parentType, parent, true);
            itemsColl.add(itemModel, {sort: false});
        }
        itemModel.get('feedbacks').add(item.comments.list.slice(- MAX_COMMENTS_COUNT).map(function (feedback) {
            feedback.owner_id = Number(feedback.from_id);
            return {
                id: generateItemID('comment', feedback),
                type: 'comment',
                feedback: feedback,
                date: feedback.date
            };
        }));
        lastCommentDate = itemModel.get('feedbacks').last().get('date');
        if (!itemModel.has('date') || itemModel.get('date') < lastCommentDate) {
            itemModel.set('date', lastCommentDate);
        }
        itemModel.trigger('change');
    }
    /**
     * Handles news' item.
     * If parent is already in collection,
     * then adds feedback to parent's feedbacks collection.
     * Doesn't sort itemsColl
     *
     * @param {Object} item
     */
    function addRawNotificationsItem(item) {
        var parentType, parent = item.parent,
            feedbackType, feedback = item.feedback,
            itemID, itemModel, typeTokens;

        if (item.type === 'friend_accepted') {
            parentType = item.type;
            parent = item.feedback;
        } else if (item.type.indexOf('_') !== -1) {
            typeTokens = item.type.split('_');
            feedbackType = typeTokens[0];
            parentType = typeTokens[1];
        } else {
            parentType = item.type;
        }


        if (feedbackType) {
            parent.owner_id = Number(parent.from_id || parent.owner_id);
            itemID  = generateItemID(parentType, parent);
            if (!(itemModel = itemsColl.get(itemID))) {
                itemModel = createItemModel(parentType, parent, true);
                itemsColl.add(itemModel, {sort: false});
            }
            itemModel.get('feedbacks').add([].concat(feedback).map(function (feedback) {
                var id;

                feedback.owner_id = Number(feedback.from_id || feedback.owner_id);

                if (feedbackType === 'like' || feedbackType === 'copy') {
                    // 'like' and 'post', so we need to pass 'parent'
                    // to make difference for two likes from the same user to different objects
                    id  = generateItemID(feedbackType, parent);
                } else {
                    id  = generateItemID(feedbackType, feedback);
                }
                return {
                    id: id,
                    type: feedbackType,
                    feedback: feedback,
                    date: item.date
                };
            }));
            if (!itemModel.has('date') || itemModel.get('date') < item.date) {
                itemModel.set('date', item.date);
            }
            itemModel.trigger('change');
        } else {
            //follows and friend_accepter types are array
            [].concat(feedback).forEach(function (feedback) {
                var itemModel;
                feedback.owner_id = Number(feedback.owner_id || feedback.from_id);
                itemModel = createItemModel(parentType, feedback, false);
                itemModel.set('date', item.date);
                itemsColl.add(itemModel, {sort: false});
            });
        }
    }
    /**
     * Generates uniq id for feedback item
     *
     * @param {String} type of parent: post, comments, topic etc
     * @param {Object} parent
     *
     * @return {String}
     */
    function generateItemID(type, parent) {
        if (parent.owner_id) {
            return [
                type, parent.id || parent.pid || parent.cid || parent.post_id,
                'user', parent.owner_id
            ].join(':');
        } else {
            return _.uniqueId(type);
        }
    }
    /**
     * Creates feedbacks item
     *
     * @param {String} type Type of parent: post, wall, topic, photo etc
     * @param {Object} parent
     * @param {Boolean} canHaveFeedbacks
     *
     * @return {Object}
     */
    function createItemModel(type, parent, canHaveFeedbacks) {
        var itemModel = new Backbone.Model({
            id: generateItemID(type, parent),
            parent: parent,
            type: type
        });
        if (canHaveFeedbacks) {
            // TODO implement sorting
            itemModel.set('feedbacks', new FeedbacksCollection());
        }
        return itemModel;
    }

    function fetchFeedbacks() {
        Request.api({code: [
            'return {time: API.utils.getServerTime(),',
            ' notifications: API.notifications.get(',
            JSON.stringify(autoUpdateNotificationsParams), '),',
            ' comments: API.newsfeed.getComments(',
            JSON.stringify(autoUpdateCommentsParams), ')',
            '};'
        ].join('')}).done(function (response) {
            var notifications = response.notifications,
                comments = response.comments;

            autoUpdateNotificationsParams.start_time = response.time;
            autoUpdateCommentsParams.start_time = response.time;

            // first item in notifications contains quantity
            if ((notifications.items && notifications.items.length > 1)
                || (comments.items && comments.items.length)) {
                profilesColl
                    .add(comments.profiles, {parse: true})
                    .add(comments.groups, {parse: true})
                    .add(notifications.profiles, {parse: true})
                    .add(notifications.groups, {parse: true});

                notifications.items.slice(1).forEach(addRawNotificationsItem);
                comments.items.forEach(addRawCommentsItem);
            }
            readyDeferred.resolve();
            fetchFeedbacksDebounced();
        });
    }
    fetchFeedbacksDebounced = _.debounce(fetchFeedbacks, UPDATE_PERIOD);

    // entry point
    Mediator.sub('auth:success', function (data) {
        userId = data.userId;
        initialize();
    });

    readyDeferred.then(function () {
        publishData();

        itemsColl.on('add change remove', _.debounce(function () {
            var firstModel = itemsColl.first();

            itemsColl.sort();
            persistentModel.set(
                'latestFeedbackId',
                (firstModel.has('feedbacks') ? firstModel.get('feedbacks').last():firstModel).get('id')
            );
            publishData();
        }));
        profilesColl.on('change', publishData);
    });

    Mediator.sub('likes:changed', function (params) {
        var changedItemUniqueId = [
            params.type, params.item_id,
            'user', params.owner_id
        ].join(':'), changedModel = itemsColl.get(changedItemUniqueId);

        if (changedModel) {
            changedModel.get('parent').likes = params.likes;
            itemsColl.trigger('change');
        }
    });

    Mediator.sub('feedbacks:unsubscribe', function (params) {
        var unsubscribeFromId = [
            params.type, params.item_id,
            'user', params.owner_id
        ].join(':');

        Request.api({
            code: 'return API.newsfeed.unsubscribe('
                + JSON.stringify(params)
                + ');'
        }).then(function (response) {
            if (response) {
                itemsColl.remove(itemsColl.get(unsubscribeFromId));
            }
        });
    });

    Mediator.sub('feedbacks:data:get', function () {
        readyDeferred.then(publishData);
    });
});
