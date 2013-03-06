define(['backbone', 'underscore', 'request/request', 'mediator/mediator', 'feedback/data'],
    function (Backbone, _, request, Mediator, data) {
        var
        MAX_ITEMS_COUNT = 50;

        return Backbone.Model.extend({
            startTime: '0',
            owners : new Backbone.Collection(),
            defaults: {
                items : new Backbone.Collection()
            },
            initialize: function () {
                var self = this;
                // FIXME remove after dev
                data.news.profiles.map(function (profile) {
                    profile.id = profile.uid;
                    self.owners.add(profile);
                });
                data.news.groups.map(function (group) {
                    group.id = - group.gid;
                    self.owners.add(group);
                });
                data.news.items.slice(1).map(this.processNewsItem.bind(this));

                request.api({
                    code: ['return { "news" : API.notifications.get({start_time: ',
                        this.startTime, ', "count" : "', MAX_ITEMS_COUNT,
                        '"}), "time" : API.getServerTime()};'].join('')
                }).done(function (response) {
                    self.startTime = response.time;

                    response.news.profiles.map(function (profile) {
                        profile.id = profile.uid;
                        self.owners.add(profile);
                    });
                    response.news.groups.map(function (group) {
                        group.id = - group.gid;
                        self.owners.add(group);
                    });

                    response.news.items.slice(1).map(self.processNewsItem.bind(self));
                });

                Mediator.sub('feedback:view', function () {
                    Mediator.pub('feedback:data', this.toJSON());
                }.bind(this));
            },
            /**
             * Handles news' item.
             * If parent is already in collection,
             * then adds feedback to parent's feedbacks collection
             *
             * @param {Object} item
             */
            processNewsItem: function (item) {
                var parentType, parent = item.parent,
                    feedbackType = item.type, feedback = item.feedback,
                    itemID, itemModel;

                switch (feedbackType) {
                case 'comment_post':
                case 'like_post':
                case 'copy_post':
                    parentType = 'post';
                    break;
                case 'reply_comment':
                case 'like_comment':
                    parentType = 'comment';
                    break;
                case 'comment_video':
                case 'like_video':
                case 'copy_video':
                    parentType = 'video';
                    break;
                case 'comment_photo':
                case 'like_photo':
                case 'copy_photo':
                    parentType = 'photo';
                    break;
                case 'reply_topic':
                    parentType = 'topic';
                    break;
                }
                if (parentType) {
                    itemID  = this.generateItemID(parentType, parent);
                    if (!(itemModel = this.get('items').get(itemID))) {
                        itemModel = this.createFeedbackItem(parentType, parent, true);
                        this.get('items').add(itemModel);
                    }
                    itemModel.get('feedbacks').add({
                        type: feedbackType,
                        feedback: feedback
                    });
                    itemModel.get('owners').add(
                        this.owners.get(this.getOwnerID(parent))
                    );
                } else {
                    this.get('items').add(this.createFeedbackItem(feedbackType, feedback, false));
                }
            },
            /**
             * Returns id of owner
             * @param {Object} feedback
             *
             * @return {Number}
             */
            getOwnerID: function (feedback) {
                // Only parent post object has "from_id",
                // so don't change sequence
                return feedback.owner_id || feedback.from_id;
            },
            /**
             * Generates uniq id for feedback item
             *
             * @param {String} type of parent: post, comments, topic etc
             * @param {Object} parent
             *
             * @return {String}
             */
            generateItemID: function (type, parent) {
                var ownerID = this.getOwnerID(parent);

                if (ownerID) {
                    return [
                        type, parent.id || parent.pid,
                        'user', ownerID
                    ].join(':');
                } else {
                    return _.uniqueId(type);
                }
            },
            /**
             * Creates feedbacks item
             *
             * @param {String} type Type of parent: post, wall, topic, photo etc
             * @param {Object} parent
             *
             * @return {Object}
             */
            createFeedbackItem: function (type, parent, canHaveFeedbacks) {
                var itemModel = new Backbone.Model({
                    id: this.generateItemID(type, parent),
                    parent: parent,
                    type: type,
                    owners: new Backbone.Collection([
                        this.owners.get(this.getOwnerID(parent))
                    ])
                });
                if (canHaveFeedbacks) {
                    // TODO implement sorting
                    itemModel.set('feedbacks', new Backbone.Collection());
                }
                return itemModel;
            }
        });
    }
);
