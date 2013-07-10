angular.module(
    'feedbacks',
    ['mediator', 'request', 'likes']
).run(function (Request, Mediator) {
    var MAX_ITEMS_COUNT = 50,

        readyDeferred = jQuery.Deferred(),
        profilesColl = new (Backbone.Collection.extend({
            model: Backbone.Model.extend({
                parse: function (profile) {
                    if (profile.gid) {
                        profile.id = -profile.gid;
                    }
                    return profile;
                }
            })
        }))(),
        itemsColl = new (Backbone.Collection.extend({
            parse: function (rawItems) {
                console.log(arguments);
                return rawItems.slice(1).map(processRawItem);
            }
        }))();

    /**
     * Handles news' item.
     * If parent is already in collection,
     * then adds feedback to parent's feedbacks collection
     *
     * @param {Object} item
     *
     * @returns {Object} Returns processed item or already existing parent from itemsColl
     */
    function processRawItem(item) {
        var parentType, parent = item.parent,
            feedbackType, feedback = item.feedback,
            itemID, itemModel, typeTokens;

        if (item.type.indexOf('_') !== -1) {
            typeTokens = item.type.split('_');
            feedbackType = typeTokens[0];
            parentType = typeTokens[1];
        } else {
            parentType = item.type;
        }


        if (feedbackType) {
            itemID  = generateItemID(parentType, parent);
            if (!(itemModel = itemsColl.get(itemID))) {
                parent.owner_id = Number(parent.owner_id || parent.from_id);
                itemModel = createItemModel(parentType, parent, true);
            }
            itemModel.get('feedbacks').add([].concat(feedback).map(function (feedback) {
                feedback.owner_id = Number(feedback.owner_id || feedback.from_id);
                return {
                    type: feedbackType,
                    feedback: feedback
                };
            }));
            return itemModel;
        } else {
            feedback.owner_id = Number(feedback.owner_id || feedback.from_id);
            return createItemModel(parentType, feedback, false);
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
                type, parent.id || parent.pid,
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
            itemModel.set('feedbacks', new Backbone.Collection());
        }
        return itemModel;
    }

    function fetchFeedbacks() {
        Request.api({code: [
            'return API.notifications.get({"count" : "', MAX_ITEMS_COUNT, '"});'
        ].join('')}).done(function (response) {
            profilesColl
                .add(response.profiles, {parse: true})
                .add(response.groups, {parse: true});

            itemsColl.add(response.items, {parse: true});
            readyDeferred.resolve();
        });
    }

    fetchFeedbacks();

    Mediator.sub('feedbacks:data:get', function () {
        readyDeferred.then(function () {
            Mediator.pub('feedbacks:data', {
                profiles: profilesColl.toJSON(),
                items: itemsColl.toJSON()
            });
        });
    });
});
