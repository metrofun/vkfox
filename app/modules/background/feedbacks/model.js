define(['backbone', 'underscore', 'request/request', 'mediator/mediator', 'feedback/data'],
    function (Backbone, _, request, Mediator, data) {
        var
        MAX_ITEMS_COUNT = 50;

        return Backbone.Model.extend({
            startTime: '0',
            defaults: {
                items: new Backbone.Collection(),
                profiles: new Backbone.Collection()
            },
            initialize: function () {
                var self = this;

                this.normalizeResponse(data);

                this.get('profiles').add(data.news.profiles);
                this.get('profiles').add(data.news.groups);
                data.news.items.slice(1).forEach(this.processNewsItem, this);

                request.api({
                    code: ['return { "news" : API.notifications.get({start_time: ',
                        this.startTime, ', "count" : "', MAX_ITEMS_COUNT,
                        '"}), "time" : API.getServerTime()};'].join('')
                }).done(function (response) {
                    self.normalizeResponse(response);

                    self.startTime = response.time;

                    self.get('profiles').add(response.news.profiles);
                    self.get('profiles').add(response.news.groups);

                    response.news.items.slice(1).forEach(self.processNewsItem, self);
                });

                Mediator.sub('feedback:data:get', function () {
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
                    itemID  = this.generateItemID(parentType, parent);
                    if (!(itemModel = this.get('items').get(itemID))) {
                        itemModel = this.createFeedbackItem(parentType, parent, true);
                        this.get('items').add(itemModel);
                    }
                    itemModel.get('feedbacks').add([].concat(feedback).map(function (feedback) {
                        return {
                            type: feedbackType,
                            feedback: feedback
                        };
                    }));
                } else {
                    this.get('items').add(this.createFeedbackItem(parentType, feedback, false));
                }
            },
            /**
             * Normalizes response from vk.
             *
             * @params {Object} data
             */
            normalizeResponse: function (data) {
                var news = data.news;

                news.groups.forEach(function (group) {
                    group.id = -group.gid;
                });
                news.profiles.forEach(function (profile) {
                    profile.id = profile.uid;
                });

                news.items.slice(1).forEach(function (item) {
                    var feedback = item.feedback,
                        parent = item.parent;

                    [].concat(feedback).forEach(function (feedback) {
                        feedback.owner_id = Number(feedback.owner_id || feedback.from_id);
                    });

                    if (parent) {
                        parent.owner_id = Number(parent.owner_id || parent.from_id);
                    }
                });
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
                if (parent.owner_id) {
                    return [
                        type, parent.id || parent.pid,
                        'user', parent.owner_id
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
             * @param {Boolean} canHaveFeedbacks
             *
             * @return {Object}
             */
            createFeedbackItem: function (type, parent, canHaveFeedbacks) {
                var itemModel = new Backbone.Model({
                    id: this.generateItemID(type, parent),
                    parent: parent,
                    type: type
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
