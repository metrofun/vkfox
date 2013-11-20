var
MAX_ITEMS_COUNT = 50,
MAX_COMMENTS_COUNT = 3,
UPDATE_PERIOD = 2000, //ms

_ = require('underscore')._,
Vow = require('vow'),
Backbone = require('backbone'),
Request = require('modules/request/request.js'),
User = require('modules/users/users.js'),
Mediator = require('modules/mediator/mediator.js'),
Router = require('modules/router/router.js'),
Browser = require('modules/browser/browser.js'),
I18N = require('modules/i18n/i18n.js'),
PersistentModel = require('modules/persistent-model/persistent-model.js'),
Notifications = require('modules/notifications/notifications.js'),
ProfilesCollection = require('modules/profiles-collection/profiles-collection.js'),

readyPromise = Vow.promise(),
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
/**
 * Updates "latestFeedbackId" with current last item(parentId+feedbackId)
 * Should be called on every change
 */
function updateLatestFeedbackId() {
    var firstModel = itemsColl.first(), identifier;

    if (firstModel) {
        identifier = firstModel.get('id');

        if (firstModel.has('feedbacks')) {
            identifier += ':' + firstModel.get('feedbacks').last().get('id');
        }
        persistentModel.set('latestFeedbackId', identifier);
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
            // replace wall with post,
            // to make correct merging items from 'notifications.get' and 'newsfeed.getComments'
            type === 'wall' ? 'post':type,
            parent.id || parent.pid || parent.cid || parent.post_id,
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
function createItemModel(type, parent) {
    var itemModel = new Backbone.Model({
        id: generateItemID(type, parent),
        parent: parent,
        type: type
    });
    return itemModel;
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

    // do nothing if no comments
    if (!(item.comments.list && item.comments.list.length)) {
        return;
    }

    parent.owner_id = Number(parent.from_id || parent.source_id);
    itemID  = generateItemID(parentType, parent);
    if (!(itemModel = itemsColl.get(itemID))) {
        itemModel = createItemModel(parentType, parent);
        itemsColl.add(itemModel, {sort: false});
    }
    if (!itemModel.has('feedbacks')) {
        itemModel.set('feedbacks', new FeedbacksCollection());
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
 * Returns true for supported feedback types
 * @param {String} type
 *
 * @returns {Boolean}
 */
function isSupportedType(type) {
    var forbidden = [
        'mention_comments',
        'reply_comment',
        'reply_comment_photo',
        'reply_comment_video',
        'reply_topic'
    ];

    return forbidden.indexOf(type) === -1;
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

    if (!isSupportedType(item.type)) {
        return;
    }

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
            itemModel = createItemModel(parentType, parent);
            itemsColl.add(itemModel, {sort: false});
        }
        if (!itemModel.has('feedbacks')) {
            itemModel.set('feedbacks', new FeedbacksCollection());
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
            itemModel = createItemModel(parentType, feedback);
            itemModel.set('date', item.date);
            itemsColl.add(itemModel, {sort: false});
        });
    }
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
            itemsColl.sort();
        }
        readyPromise.fulfill();
        fetchFeedbacksDebounced();
    });
}
fetchFeedbacksDebounced = _.debounce(fetchFeedbacks, UPDATE_PERIOD);


function tryNotification() {
    var itemModel = itemsColl.first(),
    lastFeedback, notificationItem, type, parentType,
    profile, ownerId, gender, title, message, name;

    // don't notify on first run,
    // when there is no previous value
    if (!this._previousAttributes.hasOwnProperty('latestFeedbackId')) {
        return;
    }

    if (itemModel.has('feedbacks')) { // notification has parent, e.g. comment to post, like to video etc
        lastFeedback = itemModel.get('feedbacks').last();
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
            profile = profilesColl.get(ownerId).toJSON();
            name = User.getName(profile);
            gender = profile.sex === 1 ? 'female':'male';
        } catch (e) {
            console.log(ownerId, profile, name);
            throw e;
        }

        switch (type) {
            case 'friend_accepted':
                title = name + ' ' + I18N.get('friend request accepted', {
                    GENDER: gender
                });
                break;
            case 'follow':
                title = name + ' ' + I18N.get('started following you', {
                    GENDER: gender
                });
                break;
            case 'mention':
                title = name + ' ' + I18N.get('mentioned you', {
                    GENDER: gender
                });
                message = notificationItem.text;
                break;
            case 'wall':
                title = name + ' ' + I18N.get('posted on your wall', {
                    GENDER: gender
                });
                message = notificationItem.text;
                break;
            case 'like':
                title = name + ' ' + I18N.get('liked your ' + parentType, {
                    GENDER: gender
                });
                break;
            case 'copy':
                title = name + ' ' + I18N.get('shared your ' + parentType, {
                    GENDER: gender
                });
                break;
            case 'comment':
                // 'mention_commentS' type in notifications
            case 'comments':
            case 'reply':
                title = I18N.get('left a comment', {
                    NAME: name,
                    GENDER: gender
                });
                message = notificationItem.text;
                break;
        }

        if (title) {
            // Don't notify, when active tab is vk.com
            Browser.isVKSiteActive().then(function (active) {
                var feedbacksActive = Browser.isPopupOpened()
                    && Router.isFeedbackTabActive();

                if (!active) {
                    Notifications.notify({
                        type: Notifications.NEWS,
                        title: title,
                        message: message,
                        image: profile.photo,
                        noBadge: feedbacksActive,
                        noPopup: feedbacksActive
                    });
                }
            });
        }
    }
}
/**
 * Initialize all variables
 */
function initialize() {
    if (!readyPromise || readyPromise.isFulfilled()) {
        if (readyPromise) {
            readyPromise.reject();
        }
        readyPromise = Vow.promise();
    }
    readyPromise.then(function () {
        persistentModel = new PersistentModel({}, {
            name: ['feedbacks', 'background', userId].join(':')
        });
        persistentModel.on('change:latestFeedbackId', tryNotification);

        updateLatestFeedbackId();
        publishData();
    }).done();

    autoUpdateNotificationsParams = {
        count: MAX_ITEMS_COUNT
    };
    autoUpdateCommentsParams = {
        last_comments: 1,
        count: MAX_ITEMS_COUNT
    };
    itemsColl.reset();
    profilesColl.reset();
    fetchFeedbacks();
}

// entry point
Mediator.sub('auth:success', function (data) {
    userId = data.userId;
    initialize();
});

readyPromise.then(function () {
    itemsColl.on('add change remove', _.debounce(function () {
        itemsColl.sort();
        updateLatestFeedbackId();
        publishData();
    }));
    profilesColl.on('change', publishData);
}).done();

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
    readyPromise.then(publishData).done();
});
