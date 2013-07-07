angular.module('app', ['auth', 'buddies', 'chat', 'newsfeed']);

define([
    'backbone',
    'auth/model',
    'chat/model',
    'newsfeed/model',
    'feedback/model',
    'users/model',
    'longpoll/model',
    'buddies/model',
    'mediator/mediator',
], function (
    Backbone,
    AuthModel,
    ChatModel,
    NewsfeedModel,
    FeedbackModel,
    UsersModel,
    BuddiesModel,
    LongpollModel,
    Mediator
) {
    return Backbone.Model.extend({
        //FIXME unimplemented
        attributes: {
            state: 'loading'
        },
        initialize: function () {
            var
            authModel = new AuthModel(),
            newsfeedModel, feedbackModel,
            chatModel, usersModel,
            longpollModel, buddiesModel;

            Mediator.sub('app:view', function () {
                Mediator.pub('app:data', this.toJSON());
            }.bind(this));

            Mediator.sub('auth:success', function (authData) {
                usersModel = new UsersModel();
                longpollModel = new LongpollModel();
                chatModel = new ChatModel({
                    userId: authData.userId
                });
                buddiesModel = new BuddiesModel();
                newsfeedModel = new NewsfeedModel();
                feedbackModel = new FeedbackModel();
            });
        }
    });
});

angular.module('auth', []).factory('Auth', function (Mediator) {
    var APP_ID = 1920884,
        AUTH_DOMAIN = 'http://oauth.vk.com/',
        RETRY_INTERVAL = 10000,
        AUTH_URI = [
            AUTH_DOMAIN,
            'authorize?',
            [
                'client_id=' + APP_ID,
                'scope=539774',
                'response_type=token',
                'display=touch'
            ].join('&')
        ].join(''),
        CREATED = 1,
        IN_PROGRESS = 1,
        READY = 2,

        $iframe, model = new Backbone.Model(),
        state = CREATED, authDeferred = jQuery.Deferred();

    // FIXME http://code.google.com/p/chromium/issues/detail?id=63122
    chrome.extension.onRequest.addListener(function () {});

    Mediator.sub('auth:iframe', function (url) {
        try {
            model.set('userId',  parseInt(url.match(/user_id=(\w+)(?:&|$)/i)[1], 10));
            model.set('accessToken',  url.match(/access_token=(\w+)(?:&|$)/i)[1]);

            $iframe.remove();
            // save memory
            $iframe = null;
        } catch (e) {
            // TODO control console.log
            console.log(e);
        }
    }.bind(this));

    model.on('change:accessToken', function () {
        Mediator.pub('auth:success', model.toJSON());
    });

    return {
        retry: _.debounce(function () {
            if (state === IN_PROGRESS) {
                this.login(true);
                this.retry();
            }
        }, RETRY_INTERVAL),
        onSuccess: function (data) {
            state = READY;

            authDeferred.resolve(data);
        },
        login: function (force) {
            if (force || state === CREATED) {
                state = IN_PROGRESS;

                if (authDeferred.state() === 'resolved') {
                    authDeferred = jQuery.Deferred();
                }

                if (!$iframe) {
                    $iframe = angular.element(
                        '<iframe/>',
                        {name : 'vkfox-login-iframe'}
                    ).appendTo('body');
                }
                $iframe.attr('src', AUTH_URI);
                this.retry();

                Mediator.unsub('auth:success', this.onSuccess);
                Mediator.once('auth:success', this.onSuccess);
            }
            return authDeferred;
        },
        getAccessToken: function () {
            return this.login().then(function () {
                return model.get('accessToken');
            });
        },
        getUserId: function () {
            return this.login().then(function () {
                return model.get('userId');
            });
        }
    };
});

define(['underscore', 'mediator/mediator', 'jtoh', 'auth/tpl', 'jquery', 'backbone'],
    function (_, Mediator, jtoh, template, jQuery, Backbone) {
        var
        APP_ID = 1920884,
        AUTH_DOMAIN = 'http://oauth.vk.com/',
        RETRY_INTERVAL = 10000;

        return Backbone.Model.extend({
            el: document.body,
            defaults: {
                accessToken: undefined,
                userId: undefined
            },
            authURL: [
                AUTH_DOMAIN,
                'authorize?',
                [
                    'client_id=' + APP_ID,
                    'scope=539774',
                    'redirect_uri=http://oauth.vk.com/blank.html',
                    'response_type=token',
                    'display=wap'
                ].join('&')
            ].join(''),
            initialize: function () {
                // FIXME http://code.google.com/p/chromium/issues/detail?id=63122
                chrome.extension.onRequest.addListener(function () {});

                Mediator.sub('auth:login', this.login.bind(this));
                Mediator.sub('auth:iframe', function (url) {
                    try {
                        this.set('userId',  parseInt(url.match(/user_id=(\w+)(?:&|$)/i)[1], 10));
                        // save memory
                        this.set('accessToken',  url.match(/access_token=(\w+)(?:&|$)/i)[1]);
                        this.$iframe.remove();
                        delete this.$iframe;
                    } catch (e) {
                        // FIXME control console.log
                        console.log(e);
                    }
                }.bind(this));

                this.on('change:accessToken', function () {
                    Mediator.pub('auth:success', {
                        accessToken: this.get('accessToken'),
                        userId: this.get('userId')
                    });
                });

                this.login();
            },
            retry: _.debounce(function () {
                if (this.$iframe) {
                    // reload iframe
                    this.$iframe.attr('src', this.authURL);
                    this.retry();
                }
            }, RETRY_INTERVAL),
            login: function () {
                if (!this.$iframe) {
                    this.$iframe = jQuery(jtoh(template).build(this.authURL));
                } else {
                    this.$iframe.attr('src', this.authURL);
                }
                this.$iframe.appendTo(this.el);

                this.retry();
            }
        });
    }
);


define(function () {
    return {
        tagName: 'iframe',
        attributes: {
            name: 'vkfox-login-iframe',
            src: function (src) {return src; }
        }
    };
});

if (window.name === 'vkfox-login-iframe') {
    chrome.extension.sendMessage(['auth:iframe', decodeURIComponent(window.location.href)]);
}

angular.module(
    'buddies',
    ['users', 'request', 'mediator', 'persistent-set']
).run(function (Users, Request, Mediator, PersistentSet) {
    var readyDeferred = jQuery.Deferred(),
        watchedBuddiesSet = new PersistentSet('watchedBuddies'),
        buddiesColl = new (Backbone.Collection.extend({
            model: Backbone.Model.extend({
                idAttribute: 'id'
            }),
            comparator: function (buddie) {
                if (buddie.get('isWatched')) {
                    return -2;
                } else if (buddie.get('isFave')) {
                    return -1;
                } else {
                    return buddie.get('originalIndex') || 0;
                }
            }
        }))();

    /**
     * After changing and unchanging any field of buddie,
     * we need to place it to original place in list,
     * So we add index property.
     * Runs once.
     */
    function saveOriginalBuddiesOrder() {
        var length = buddiesColl.length;

        if (length && !buddiesColl.at(length - 1).get('originalIndex')) {
            buddiesColl.forEach(function (buddie, i) {
                buddie.set('originalIndex', i);
            });
        }
    }

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
                    profile.set('isFave', true);
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

        saveOriginalBuddiesOrder();

        watchedBuddiesSet.toArray().forEach(function (uid) {
            var model = buddiesColl.get(uid);
            if (model) {
                model.set('isWatched', true);
            }
        });
        // resort if any profile was changed
        if (watchedBuddiesSet.size()) {
            buddiesColl.sort();
        }
        readyDeferred.resolve();
    });

    Mediator.sub('buddies:data:get', function () {
        readyDeferred.then(function () {
            Mediator.pub('buddies:data', buddiesColl.toJSON());
        });
    });

    Mediator.sub('buddies:watch:toggle', function (uid) {
        if (watchedBuddiesSet.contains(uid)) {
            watchedBuddiesSet.remove(uid);
            buddiesColl.get(uid).unset('isWatched');
        } else {
            watchedBuddiesSet.add(uid);
            buddiesColl.get(uid).set('isWatched', true);
        }
        if (buddiesColl.get(uid).hasChanged()) {
            buddiesColl.sort();
            Mediator.pub('buddies:data', buddiesColl.toJSON());
        }
    });
});

define([
    'backbone',
    'underscore',
    'request/request',
    'mediator/mediator',
    'users/model',
    'jquery'
], function (Backbone, _, request, Mediator, UsersModel, jQuery) {
    return Backbone.Model.extend({
        defaults: {
            buddies: new (Backbone.Collection.extend({
                model: Backbone.Model.extend({
                    idAttribute: 'uid'
                }),
                comparator: function (buddie) {
                    if (buddie.get('favourite')) {
                        return -1;
                    } else {
                        return buddie.get('originalIndex') || 0;
                    }
                }
            }))()
        },
        getFriendsDeferred: new jQuery.Deferred(),
        initialize: function () {
            var self = this;

            self.getFavouriteUsers();
            Mediator.pub('users:friends:get');
            Mediator.once('users:friends', function (friends) {
                self.get('buddies').add(friends);
                self.getFriendsDeferred.resolve();
                Mediator.pub('buddies:data', friends);
            });

            Mediator.sub('buddies:data:get', function () {
                self.getFriendsDeferred.done(function () {
                    Mediator.pub('buddies:data', self.get('buddies').toJSON());
                });
            });
            Mediator.sub('buddies:favourite:toggle', self.toggleBuddieField.bind(self, 'favourite'));
            Mediator.sub('buddies:watched:toggle', self.toggleBuddieField.bind(self, 'watched'));
        },
        getFavouriteUsers: function () {
            request.api({
                code: 'return API.fave.getUsers()'
            }).then(function (response) {
                console.log(response);
                UsersModel.getProfilesById(_.pluck(response.slice(1), 'id')).then(function () {
                    console.log(arguments);
                });
            });
        },
        /**
         * Toggles boolean field of buddie.
         * If buddie is unknown, then fetch it and add to list.
         * Also resorts models.
         *
         * @param {String} field Name of field
         * @param {Number} uid Friend or non friend id
         */
        toggleBuddieField: function (field, uid) {
            var buddies = this.get('buddies'),
                profile = buddies.get(uid);

            if (profile) {
                if (profile.get(field)) {
                    if (profile.get('isFriend')) {
                        profile.unset(field);
                        buddies.sort();
                    } else {
                        buddies.remove(profile);
                    }
                } else {
                    // Need to index friends, when fields are changed
                    // So it would be correctly placed, when field unchanged
                    this.indexFriendModels();
                    profile.set(field, true);
                    buddies.sort();
                }

                Mediator.pub('buddies:data', buddies.toJSON());
            } else {
                // Need to fetch non-friend profile
                Mediator.pub('users:get', uid);
                Mediator.once('users:' + uid, function (profile) {
                    profile[field] = true;
                    buddies.unshift(profile);
                    Mediator.pub('buddies:data', buddies.toJSON());
                });
            }
        },
        /**
         * After changing and unchanging any field of buddie,
         * we need to place it to original place in list,
         * So we add index property.
         * Runs once.
         */
        indexFriendModels: function () {
            var buddies = this.get('buddies'),
                length = buddies.length;

            if (length && !buddies.at(length - 1).get('originalIndex')) {
                buddies.forEach(function (buddie, i) {
                    buddie.set('originalIndex', i);
                });
            }
        }
    });
});

/*jshint bitwise:false */
angular.module(
    'chat',
    ['request', 'mediator', 'persistent-set', 'auth', 'longpoll']
).run(function (Users, Request, Mediator, Auth) {
    var
    MAX_HISTORY_COUNT = 10,

    dialogColl = new (Backbone.Collection.extend({
        comparator: function (dialog) {
            var messages = dialog.get('messages');
            return - messages[messages.length - 1].date;
        }
    }))(),
    userId, readyDeferred = jQuery.Deferred();

    /*
     * @param {Object} update Update object from long poll
     */
    function addNewMessage(update) {
        var messageId = update[1],
            flags = update[2],
            attachment = update[7],
            dialog, messageDeferred,
            dialogCompanionUid = update[3],
            out;

        // For messages from chat attachment contains "from" property
        if (_(attachment).isEmpty()) {
            out = +!!(flags & 2);

            // mimic response from server
            messageDeferred = jQuery.Deferred().resolve({
                count: 1,
                items: [{
                    body: update[6],
                    title: update[5],
                    date: update[4],
                    uid: out ? userId:dialogCompanionUid,
                    read_state: +!(flags & 1),
                    id: messageId
                    // out: +!!(flags & 2)
                }]
            });
        } else {
            messageDeferred = Request.api({
                code: 'return API.messages.getById({mid: ' + messageId + '});'
            });
        }

        messageDeferred.done(function (response) {
            var message = response.items[0],
                dialogId = message.chat_id ? 'chat_id_' + message.chat_id:'uid_' + dialogCompanionUid;

            dialog = dialogColl.get(dialogId);
            if (dialog) {
                dialog.get('messages').push(message);
                removeReadMessages(dialog);
            } else {
                dialogColl.add({
                    id: dialogId,
                    uid: dialogCompanionUid,
                    chat_id: message.chat_id,
                    messages: [message]
                });

                setDialogsProfiles();
            }
        });
    }
    function setDialogsProfiles() {
        return jQuery.when.apply(jQuery, dialogColl.map(function (dialog) {
            var
            uids = _.uniq(_.flatten(dialog.get('messages').map(function (message) {
                var chatActive = message.chat_active;
                if (chatActive) {
                    return chatActive.map(function (uid) {
                        return parseInt(uid, 10);
                    }).concat(userId);
                } else {
                    return [message.uid, dialog.get('uid')];
                }
            })));

            if (uids.length) {
                return Users.getProfilesById(uids).then(function (data) {
                    dialog.set('profiles', [].concat(data));
                });
            } else {
                dialog.set('profiles', []);
                return jQuery.Deferred().resolve();
            }
        }));
    }
    /*
     * Removes read messages from dialog,
     * leaves only first one or unread in sequence
     *
     * @param {Backbone.Model} dialog subject for mutation
     */
    function removeReadMessages(dialog) {
        var messages = dialog.get('messages'),
            updatedMessages = [messages[messages.length - 1]],
            dialogCompanionUid = messages[messages.length - 1].uid;

        messages.reverse().slice(1).some(function (message) {
            if (message.id !== dialogCompanionUid && message.read_state) {
                return true;
            } else {
                updatedMessages.unshift(message);
            }
        });
        dialog.set('messages', updatedMessages);
    }
    /*
     * If last message in dialog is unread,
     * fetch dialog history and get last unread messages in a row
     */
    function getUnreadMessages() {
        // FIXME wtf models.filter?
        var unreadDialogs = dialogColl.models.filter(function (dialog) {
            return !dialog.get('chat_id') && !dialog.get('messages')[0].read_state;
        }),
        unreadHistoryRequests = unreadDialogs.map(function (dialog) {
            return Request.api({code: 'return API.messages.getHistory({user_id: '
                + dialog.get('uid') + ', count: '
                + MAX_HISTORY_COUNT + '});'});
        });

        return jQuery.when.apply(jQuery, unreadHistoryRequests).done(function () {
            _(arguments).each(function (historyMessages, index) {
                if (historyMessages && historyMessages.count) {
                    unreadDialogs[index].set(
                        'messages',
                        historyMessages.items.reverse().map(convertHistoryIntoMessageData)
                    );
                    removeReadMessages(unreadDialogs[index]);
                }
            });
        });
    }
    function onUpdates(updates) {
        updates.forEach(function (update) {
            var messageId, mask;

            // @see http://vk.com/developers.php?oid=-17680044&p=Connecting_to_the_LongPoll_Server
            switch (update[0]) {
                // reset message flags (FLAGS&=~$mask)
            case 3:
                messageId = update[1],
                mask = update[2];
                if (messageId && mask) {
                    dialogColl.some(function (dialog) {
                        return dialog.get('messages').some(function (message) {
                            if (message.id === messageId) {
                                message.read_state = mask & 1;
                                removeReadMessages(dialog);
                                dialogColl.trigger('change');
                                return true;
                            }
                        });
                    });
                }
                break;
            case 4:
                addNewMessage(update);
                break;
            }
        });
    }
    function convertHistoryIntoMessageData(history) {
        var message = history;

        message.uid = history.from_id;

        return message;
    }
    function convertDialogIntoMessageData(dialog) {
        var message = dialog;

        if (message.out) {
            message.uid = userId;
            delete message.out;
        }
        return message;
    }
    function getDialogs() {
        return Request.api({
            code: 'return API.messages.getDialogs({preview_length: 0});'
        }).then(function (response) {
            if (response && response.count) {
                dialogColl.reset(response.items.map(function (item) {
                    // convert dialog data into message data
                    return {
                        id: item.chat_id ? 'chat_id_' + item.chat_id:'uid_' + item.uid,
                        chat_id: item.chat_id,
                        uid: item.uid,
                        messages: [convertDialogIntoMessageData(item)]
                    };
                }));
            }
        });
    }

    Auth.getUserId().then(function (uid) {
        userId = uid;

        getDialogs().then(getUnreadMessages).then(setDialogsProfiles).then(function () {
            readyDeferred.resolve();
        });
    });

    Mediator.sub('chat:data:get', function () {
        readyDeferred.then(function () {
            Mediator.pub('chat:data', dialogColl.toJSON());
        });
    });
    readyDeferred.then(function () {
        Mediator.sub('longpoll:updates', onUpdates);

        dialogColl.on('change', function () {
            dialogColl.sort();
            Mediator.pub('chat:data', dialogColl.toJSON());
        });
    });
});

/*jshint bitwise:false */
define([
    'underscore',
    'backbone',
    'request/request',
    'mediator/mediator',
    'auth/model'
], function (_, Backbone, request, Mediator, AuthModel) {
    var LONG_POLL_WAIT = 25,
        MAX_HISTORY_COUNT = 10;

    return Backbone.Model.extend({
        defaults: {
            dialogs : new (Backbone.Collection.extend({
                comparator: function (dialog) {
                    var messages = dialog.get('messages');
                    return - messages[messages.length - 1].date;
                }
            }))()
        },
        getDialogs: function () {
            var self = this;

            return request.api({
                code: 'return API.messages.getDialogs({preview_length: 0});'
            }).done(function (response) {
                if (response && response.count) {
                    self.get('dialogs').reset(response.items.map(function (item) {
                        // convert dialog data into message data
                        return {
                            id: item.chat_id ? 'chat_id_' + item.chat_id:'uid_' + item.uid,
                            chat_id: item.chat_id,
                            uid: item.uid,
                            messages: [self.convertDialogIntoMessageData(item)]
                        };
                    }));
                }
            });
        },
        /*
         * If last message in dialog is unread,
         * fetch dialog history and get last unread messages in a row
         */
        getUnreadMessages: function () {
            // FIXME wtf models.filter?
            var unreadDialogs = this.get('dialogs').models.filter(function (dialog) {
                return !dialog.get('chat_id') && !dialog.get('messages')[0].read_state;
            }),
            unreadHistoryRequests = unreadDialogs.map(function (dialog) {
                return request.api({
                    code: 'return API.messages.getHistory({uid: ' + dialog.get('uid') + ', count: ' + MAX_HISTORY_COUNT + '});'
                });
            }), self = this;

            return jQuery.when.apply(jQuery, unreadHistoryRequests).done(function () {
                _(arguments).each(function (unreadMessages, index) {
                    if (unreadMessages && unreadMessages.count) {
                        unreadDialogs[index].set('messages', unreadMessages.items.reverse());
                        self.removeReadMessages(unreadDialogs[index]);
                    }
                });
            });
        },
        /*
         * Removes read messages from dialog,
         * leaves only first one or unread in sequence
         *
         * @param {Backbone.Model} dialog subject for mutation
         */
        removeReadMessages: function (dialog) {
            var messages = dialog.get('messages'),
                updatedMessages = [], dialogCompanionUid = messages[messages.length - 1].uid;

            messages.reverse().some(function (message) {
                if (message.uid !== dialogCompanionUid && message.read_state) {
                    return true;
                } else {
                    updatedMessages.unshift(message);
                }
            });
            dialog.set('messages', updatedMessages);
        },
        convertDialogIntoMessageData: function (dialog) {
            var message = dialog;
            if (message.out) {
                message.uid = this.userId;
                delete message.out;
            }
            return message;
        },
        getProfiles: function () {
            var self = this;
            return jQuery.when.apply(jQuery, this.get('dialogs').map(function (dialog) {
                var
                uids = _.uniq(_.flatten(dialog.get('messages').map(function (message) {
                    var chatActive = message.chat_active;
                    if (chatActive) {
                        return chatActive.map(function (uid) {
                            return parseInt(uid, 10);
                        }).concat(self.userId);
                    } else {
                        return [message.uid, dialog.get('uid')];
                    }
                }))),
                deffer = jQuery.Deferred();

                if (uids.length) {
                    Mediator.pub('users:get', uids);
                    Mediator.once('users:' + uids.join(), function handler(data) {
                        dialog.set('profiles', [].concat(data));
                        deffer.resolve();
                    });
                } else {
                    dialog.set('profiles', []);
                    deffer.resolve();
                }
                return deffer;
            }));
        },
        initialize: function (params) {
            var self = this;

            this.userId = params.userId;
            this.getDialogs().done(function () {
                jQuery.when(
                    self.getUnreadMessages(),
                    self.getProfiles()
                ).done(function () {
                    Mediator.sub('chat:data:get', function () {
                        Mediator.pub('chat:data', self.toJSON());
                    });
                    Mediator.pub('chat:data', self.toJSON());
                });
            });
            Mediator.sub('longpoll:updates', this.onUpdates.bind(this));
        },
        onUpdates: function (updates) {
            updates.forEach(function (update) {
                var messageId, mask;
                console.log(update);

                // @see http://vk.com/developers.php?oid=-17680044&p=Connecting_to_the_LongPoll_Server
                switch (update[0]) {
                    // reset message flags (FLAGS&=~$mask)
                case 3:
                    messageId = update[1],
                    mask = update[2];
                    if (messageId && mask) {
                        this.get('dialogs').some(function (dialog) {
                            return dialog.get('messages').some(function (message) {
                                if (message.mid === messageId) {
                                    message.read_state = mask & 1;
                                    this.removeReadMessages(dialog);
                                    Mediator.pub('chat:data', this.toJSON());
                                    return true;
                                }
                            }, this);
                        });
                    }
                    break;
                case 4:
                    this.addNewMessage(update);
                    break;
                }
            }, this);
        },
        /*
         * @param {Object} update Update object from long poll
         */
        addNewMessage: function (update) {
            var messageId = update[1],
                flags = update[2],
                attachment = update[7],
                message, dialog, messageDeferred,
                dialogCompanionUid = update[3],
                self = this, out;

            console.log('update', update);
            // For messages from chat attachment contains "from" property
            if (_(attachment).isEmpty()) {
                out = +!!(flags & 2);
                messageDeferred = jQuery.Deferred().resolve({
                    count: 1,
                    items: {
                        body: update[6],
                        title: update[5],
                        date: update[4],
                        uid: out ? self.userId:dialogCompanionUid,
                        read_state: +!(flags & 1),
                        mid: messageId,
                        // out: +!!(flags & 2)
                    }
                });
            } else {
                messageDeferred = request.api({
                    code: 'return API.messages.getById({mid: ' + messageId + '});'
                });
            }

            messageDeferred.done(function (response) {
                var message = response.items[0],
                    dialogId = message.chat_id ? 'chat_id_' + message.chat_id:'uid_' + dialogCompanionUid;

                dialog = self.get('dialogs').get(dialogId);
                if (dialog) {
                    dialog.get('messages').push(message);
                    self.removeReadMessages(dialog);
                    self.get('dialogs').sort();
                    Mediator.pub('chat:data', self.toJSON());
                } else {
                    self.get('dialogs').add({
                        id: dialogId,
                        uid: dialogCompanionUid,
                        chat_id: message.chat_id,
                        messages: [message]
                    });

                    self.get('dialogs').sort();
                    self.getProfiles().done(function () {
                        Mediator.pub('chat:data', self.toJSON());
                    });
                }
            });
        }
    });
});

define(function () {
    return {
        "news": {
            "items": [18, {
                "type": "comment_photo",
                "date": 1354022536,
                "parent": {
                    "pid": 291830567,
                    "aid": -7,
                    "owner_id": 8935126,
                    "src": "http://cs302214.userapi.com/v302214126/6523/7rQfs57PTQU.jpg",
                    "src_big": "http://cs302214.userapi.com/v302214126/6524/Q-i8cEvezjc.jpg",
                    "src_small": "http://cs302214.userapi.com/v302214126/6522/6e-k0sugLm0.jpg",
                    "src_xbig": "http://cs302214.userapi.com/v302214126/6525/tmiKZjlJ1qg.jpg",
                    "src_xxbig": "http://cs302214.userapi.com/v302214126/6526/2zYBGn8a5OI.jpg",
                    "width": 1280,
                    "height": 849,
                    "text": "",
                    "created": 1353963672
                },
                "feedback": {
                    "owner_id": "19709326",
                    "id": "110445608",
                    "text": "Зато тут гарно)",
                    "date": 1354022536,
                    "likes": {
                        "count": 0,
                        "user_likes": 0
                    }
                }
            }, {
                "type": "comment_photo",
                "date": 1354022487,
                "parent": {
                    "pid": 291830576,
                    "aid": -7,
                    "owner_id": 8935126,
                    "src": "http://cs302214.userapi.com/v302214126/6550/-rC4UUOMyxs.jpg",
                    "src_big": "http://cs302214.userapi.com/v302214126/6551/CGRpXqI7YUQ.jpg",
                    "src_small": "http://cs302214.userapi.com/v302214126/654f/uiucXBqXHHc.jpg",
                    "src_xbig": "http://cs302214.userapi.com/v302214126/6552/9hrvWkEx_YA.jpg",
                    "src_xxbig": "http://cs302214.userapi.com/v302214126/6553/DSHKzb9fvTo.jpg",
                    "width": 1280,
                    "height": 848,
                    "text": "",
                    "created": 1353963679
                },
                "feedback": {
                    "owner_id": "19709326",
                    "id": "110445592",
                    "text": "І тут так собі...",
                    "date": 1354022487,
                    "likes": {
                        "count": 0,
                        "user_likes": 0
                    }
                }
            }, {
                "type": "comment_photo",
                "date": 1354022471,
                "parent": {
                    "pid": 291830579,
                    "aid": -7,
                    "owner_id": 8935126,
                    "src": "http://cs302214.userapi.com/v302214126/6562/XoE87-KO5ok.jpg",
                    "src_big": "http://cs302214.userapi.com/v302214126/6563/E6QMJJERlcM.jpg",
                    "src_small": "http://cs302214.userapi.com/v302214126/6561/hv2bHXncbks.jpg",
                    "src_xbig": "http://cs302214.userapi.com/v302214126/6564/drHnAKnNing.jpg",
                    "src_xxbig": "http://cs302214.userapi.com/v302214126/6565/8ZUhizvO1f0.jpg",
                    "width": 1280,
                    "height": 855,
                    "text": "",
                    "created": 1353963681
                },
                "feedback": {
                    "owner_id": "19709326",
                    "id": "110445586",
"text": "А тут не дуже)",
"date": 1354022471,
"likes": {
    "count": 0,
    "user_likes": 0
}
                }
            }, {
                "type": "comment_photo",
                "date": 1354022456,
                "parent": {
                    "pid": 291830569,
                    "aid": -7,
                    "owner_id": 8935126,
                    "src": "http://cs302214.userapi.com/v302214126/652c/XgSMomSBCko.jpg",
                    "src_big": "http://cs302214.userapi.com/v302214126/652d/SHX77vuk-Ws.jpg",
                    "src_small": "http://cs302214.userapi.com/v302214126/652b/cLEMhMzBuZM.jpg",
                    "src_xbig": "http://cs302214.userapi.com/v302214126/652e/4FeBUwC-yns.jpg",
                    "src_xxbig": "http://cs302214.userapi.com/v302214126/652f/wdfeWXfFyXM.jpg",
                    "width": 1280,
                    "height": 848,
                    "text": "",
                    "created": 1353963673
                },
                "feedback": {
                    "owner_id": "19709326",
                    "id": "110445583",
"text": "Дуже романтично)",
"date": 1354022456,
"likes": {
    "count": 0,
    "user_likes": 0
}
                }
            }, {
                "type": "comment_photo",
                "date": 1353975105,
                "parent": {
                    "pid": 291830567,
                    "aid": -7,
                    "owner_id": 8935126,
                    "src": "http://cs302214.userapi.com/v302214126/6523/7rQfs57PTQU.jpg",
                    "src_big": "http://cs302214.userapi.com/v302214126/6524/Q-i8cEvezjc.jpg",
                    "src_small": "http://cs302214.userapi.com/v302214126/6522/6e-k0sugLm0.jpg",
                    "src_xbig": "http://cs302214.userapi.com/v302214126/6525/tmiKZjlJ1qg.jpg",
                    "src_xxbig": "http://cs302214.userapi.com/v302214126/6526/2zYBGn8a5OI.jpg",
                    "width": 1280,
                    "height": 849,
                    "text": "",
                    "created": 1353963672
                },
                "feedback": {
                    "owner_id": "5782194",
                    "id": "110440692",
                    "text": "оо, вы и в Вене были? круто!",
                    "date": 1353975104,
                    "likes": {
                        "count": 0,
                        "user_likes": 0
                    }
                }
            }, {
                "type": "comment_photo",
                "date": 1353971771,
                "parent": {
                    "pid": 291813457,
                    "aid": 153673656,
                    "owner_id": 8935126,
                    "src": "http://cs306209.userapi.com/v306209205/1397/QsZTIj1oANk.jpg",
                    "src_big": "http://cs306209.userapi.com/v306209205/1398/c4TbCXWJrNU.jpg",
                    "src_small": "http://cs306209.userapi.com/v306209205/1396/XnAE3g7G1Lg.jpg",
                    "src_xbig": "http://cs306209.userapi.com/v306209205/1399/0MzGNLwOPRk.jpg",
                    "width": 800,
                    "height": 800,
                    "text": "",
                    "created": 1353947812
                },
                "feedback": {
                    "owner_id": "7131005",
                    "id": "110440616",
"text": "Приезжайте еще!!))",
"date": 1353971771,
"likes": {
    "count": 0,
    "user_likes": 0
}
                },
                "reply": {
                    "id": "110440617",
                    "date": "1353971783",
                    "text": "[id7131005|Valery], насовсем ахаха )))"
                }
            },
            {
                "type": "reply_topic",
                "date": 1351019307,
                "parent": {
                    "id": 24440293,
                    "owner_id": -12332522,
                    "title": "ЛУЧШИЙ ТРИЛЛЕР!!! Ф И Н А Л !!! (ГОЛОСА ЗА \"Я ЛЕГЕНДА\" ЛИШЬ ПОКАЗАТЕЛЬ НЕАДЕКВАТНОСТИ ГОЛОСУЮЩИХ-ФИЛЬМ УЧАСТИЯ В ОПРОСЕ НЕ ПРИНИМАЕТ!!!)",
                    "created": 1294836553,
                    "created_by": 58033814,
                    "updated": 1351019307,
                    "updated_by": 43600757,
                    "is_closed": 0,
                    "is_fixed": 0,
                    "comments": 3695
                },
                "feedback": {
                    "owner_id": "43600757",
                    "id": "1416831",
                    "text": "[id34193798:bp-12332522_1416826|Sskey], не",
                    "date": 1351019146,
                    "likes": {
                        "count": 0,
                        "user_likes": 0
                    }
                }
            },
            {
                "type": "follow",
                "date": 1351021497,
                "feedback": [{
                    "owner_id": "43600757"
                }]
            },
            {
                "type": "reply_topic",
                "date": 1351019307,
                "parent": {
                    "id": 24440293,
                    "owner_id": -12332522,
                    "title": "ЛУЧШИЙ ТРИЛЛЕР!!! Ф И Н А Л !!! (ГОЛОСА ЗА \"Я ЛЕГЕНДА\" ЛИШЬ ПОКАЗАТЕЛЬ НЕАДЕКВАТНОСТИ ГОЛОСУЮЩИХ-ФИЛЬМ УЧАСТИЯ В ОПРОСЕ НЕ ПРИНИМАЕТ!!!)",
                    "created": 1294836553,
                    "created_by": 58033814,
                    "updated": 1351019307,
                    "updated_by": 43600757,
                    "is_closed": 0,
                    "is_fixed": 0,
                    "comments": 3695
                },
                "feedback": {
                    "owner_id": "43600757",
                    "id": "1416831",
                    "text": "[id34193798:bp-12332522_1416826|Sskey], не",
                    "date": 1351019146,
                    "likes": {
                        "count": 0,
                        "user_likes": 0
                    }
                }
            },
            {
                "type": "like_photo",
                "date": 1350632772,
                "parent": {
                    "pid": 179352753,
                    "aid": 116686825,
                    "owner_id": 34193798,
                    "src": "http://cs867.userapi.com/u34193798/116686825/m_822866d1.jpg",
                    "src_big": "http://cs867.userapi.com/u34193798/116686825/x_09c932e4.jpg",
                    "src_small": "http://cs867.userapi.com/u34193798/116686825/s_b24481c8.jpg",
                    "text": "",
                    "created": 1283616270
                },
                "feedback": [{
                    "owner_id": "43600757"
                }]
            }, {
                "type": "comment_photo",
                "date": 1350632770,
                "parent": {
                    "pid": 179352753,
                    "aid": 116686825,
                    "owner_id": 34193798,
                    "src": "http://cs867.userapi.com/u34193798/116686825/m_822866d1.jpg",
                    "src_big": "http://cs867.userapi.com/u34193798/116686825/x_09c932e4.jpg",
                    "src_small": "http://cs867.userapi.com/u34193798/116686825/s_b24481c8.jpg",
                    "text": "",
                    "created": 1283616270
                },
                "feedback": {
                    "owner_id": "43600757",
                    "id": "109334936",
                    "text": "123",
                    "date": 1350632769,
                    "likes": {
                        "count": 0,
                        "user_likes": 0
                    }
                }
            }, {
                "type": "comment_video",
                "date": 1350509106,
                "parent": {
                    "id": 163696397,
                    "owner_id": 34193798,
                    "title": "реклама ростикс kfc",
                    "description": "унянянянана",
                    "duration": 29,
                    "link": "video163696397",
                    "image": "http://cs510313.userapi.com/u13887815/video/m_5fd390fe.jpg",
                    "image_medium": "http://cs510313.userapi.com/u13887815/video/l_c0dc6031.jpg",
                    "date": 1350509085,
                    "views": 0,
                    "player": "http://vk.com/video_ext.php?oid=34193798&id=163696397&hash=67759f6b14e2b772"
                },
                "feedback": {
                    "owner_id": "43600757",
                    "id": "68632797",
                    "text": "213123",
                    "date": 1350509106,
                    "likes": {
                        "count": 0,
                        "user_likes": 0
                    }
                }
            }, {
                "type": "like_video",
                "date": 1350509103,
                "parent": {
                    "id": 163696397,
                    "owner_id": 34193798,
                    "title": "реклама ростикс kfc",
                    "description": "унянянянана",
                    "duration": 29,
                    "link": "video163696397",
                    "image": "http://cs510313.userapi.com/u13887815/video/m_5fd390fe.jpg",
                    "image_medium": "http://cs510313.userapi.com/u13887815/video/l_c0dc6031.jpg",
                    "date": 1350509085,
                    "views": 0,
                    "player": "http://vk.com/video_ext.php?oid=34193798&id=163696397&hash=67759f6b14e2b772"
                },
                "feedback": [{
                    "owner_id": "43600757"
                }]
            }, {
                "type": "like_post",
                "date": 1350503657,
                "parent": {
                    "id": 755,
                    "from_id": 34193798,
                    "to_id": 34193798,
                    "date": 1316687739,
                    "text": "",
                    "attachment": {
                        "type": "link",
                        "link": {
                            "url": "http://yabs.yandex.ua/resource/slrUXszALuu_lyvexBhhJQ.png",
                            "title": "",
                            "description": ""
                        }
                    },
                    "attachments": [{
                        "type": "link",
                        "link": {
                            "url": "http://yabs.yandex.ua/resource/slrUXszALuu_lyvexBhhJQ.png",
                            "title": "",
                            "description": ""
                        }
                    }],
                    "comments": {
                        "count": 0,
                        "can_post": 1
                    },
                    "likes": {
                        "count": 2,
                        "user_likes": 0,
                        "can_like": 1,
                        "can_publish": 0
                    },
                    "reposts": {
                        "count": 0,
                        "user_reposted": 0
                    },
                    "post_source": {
                        "type": "vk"
                    }
                },
                "feedback": [{
                    "owner_id": "43600757"
                }]
            }, {
                "type": "like_comment",
                "date": 1350503651,
                "parent": {
                    "id": 774,
                    "owner_id": 34193798,
                    "date": 1320497100,
                    "text": "[id8935126|Митя], 12d12d12d",
                    "reply_to_uid": 8935126,
                    "reply_to_cid": 764,
                    "post": {
                        "id": 753,
                        "from_id": 34193798,
                        "to_id": 34193798,
                        "date": 1316456504,
                        "text": "Why Obama's black critics are wrong - CNN.com",
                        "attachment": {
                            "type": "link",
                            "link": {
                                "url": "http://edition.cnn.com/2011/09/19/opinion/kennedy-racial-critique-obama/index.html?&amp;amp;hpt=hp_c2",
                                "title": "Why Obama's black critics are wrong - CNN.com",
                                "description": "Throughout Obama's political career, he has been dogged by accusations that he is not \"black enough\" to warrant strong support from African-Americans. ",
                                "image_src": "http://cs4642.userapi.com/u34193798/-2/x_06a9f367.jpg"
                            }
                        },
                        "attachments": [{
                            "type": "link",
                            "link": {
                                "url": "http://edition.cnn.com/2011/09/19/opinion/kennedy-racial-critique-obama/index.html?&amp;amp;hpt=hp_c2",
                                "title": "Why Obama's black critics are wrong - CNN.com",
                                "description": "Throughout Obama's political career, he has been dogged by accusations that he is not \"black enough\" to warrant strong support from African-Americans. ",
                                "image_src": "http://cs4642.userapi.com/u34193798/-2/x_06a9f367.jpg"
                            }
                        }],
                        "comments": {
                            "count": 0,
                            "can_post": 1
                        },
                        "likes": {
                            "count": 0,
                            "user_likes": 0,
                            "can_like": 1,
                            "can_publish": 0
                        },
                        "reposts": {
                            "count": 0,
                            "user_reposted": 0
                        },
                        "post_source": {
                            "type": "vk"
                        }
                    }
                },
                "feedback": [{
                    "owner_id": "43600757"
                }]
            }, {
                "type": "reply_comment",
                "date": 1350503646,
                "parent": {
                    "id": 786,
                    "owner_id": 34193798,
                    "date": 1327319821,
                    "text": "123",
                    "reply_to_uid": 34193798,
                    "reply_to_cid": 778,
                    "post": {
                        "id": 778,
                        "from_id": 34193798,
                        "to_id": 34193798,
                        "date": 1320597568,
                        "text": "...я не успеваю, но и не тараплюсь...",
                        "copy_owner_id": 8935126,
                        "copy_post_id": 5506,
                        "attachment": {
                            "type": "audio",
                            "audio": {
                                "aid": 124761871,
                                "owner_id": 8935126,
                                "performer": "Чичерина",
                                "title": "Жара",
                                "duration": 213
                            }
                        },
                        "attachments": [{
                            "type": "audio",
                            "audio": {
                                "aid": 124761871,
                                "owner_id": 8935126,
                                "performer": "Чичерина",
                                "title": "Жара",
                                "duration": 213
                            }
                        }],
                        "comments": {
                            "count": 0,
                            "can_post": 1
                        },
                        "likes": {
                            "count": 1,
                            "user_likes": 1,
                            "can_like": 0,
                            "can_publish": 0
                        },
                        "reposts": {
                            "count": 0,
                            "user_reposted": 0
                        },
                        "post_source": {
                            "type": "vk"
                        }
                    }
                },
                "feedback": {
                    "owner_id": "43600757",
                    "id": "819",
                    "text": "[id34193798|Sskey], jтвет на коммент",
                    "date": 1320597568,
                    "likes": {
                        "count": 0,
                        "user_likes": 0
                    }
                }
            }, {
                "type": "copy_post",
                "date": 1350503616,
                "parent": {
                    "id": 812,
                    "from_id": 34193798,
                    "to_id": 34193798,
                    "date": 1347820056,
                    "text": "Темуля",
                    "attachment": {
                        "type": "poll",
                        "poll": {
                            "poll_id": 51827589,
                            "question": "Темуля"
                        }
                    },
                    "attachments": [{
                        "type": "poll",
                        "poll": {
                            "poll_id": 51827589,
                            "question": "Темуля"
                        }
                    }],
                    "comments": {
                        "count": 0,
                        "can_post": 1
                    },
                    "likes": {
                        "count": 2,
                        "user_likes": 0,
                        "can_like": 1,
                        "can_publish": 0
                    },
                    "reposts": {
                        "count": 1,
                        "user_reposted": 0
                    },
                    "post_source": {
                        "type": "vk"
                    }
                },
                "feedback": [{
                    "owner_id": "43600757",
                    "id": "20"
                }]
            }, {
                "type": "like_post",
                "date": 1350490326,
                "parent": {
                    "id": 812,
                    "from_id": 34193798,
                    "to_id": 34193798,
                    "date": 1347820056,
                    "text": "Темуля",
                    "attachment": {
                        "type": "poll",
                        "poll": {
                            "poll_id": 51827589,
                            "question": "Темуля"
                        }
                    },
                    "attachments": [{
                        "type": "poll",
                        "poll": {
                            "poll_id": 51827589,
                            "question": "Темуля"
                        }
                    }],
                    "comments": {
                        "count": 0,
                        "can_post": 1
                    },
                    "likes": {
                        "count": 2,
                        "user_likes": 0,
                        "can_like": 1,
                        "can_publish": 0
                    },
                    "reposts": {
                        "count": 1,
                        "user_reposted": 0
                    },
                    "post_source": {
                        "type": "vk"
                    }
                },
                "feedback": [{
                    "owner_id": "8935126"
                }]
            }],
            "profiles": [{
                "uid": 5782194,
                "first_name": "Sandra",
                "last_name": "Udivitelnaya",
                "photo": "http://cs304403.userapi.com/v304403194/54ad/C3DnDkjNmag.jpg",
                "photo_medium_rec": "http://cs304403.userapi.com/v304403194/54ac/F2Xah0TscmQ.jpg",
                "sex": 1,
                "online": 0,
                "screen_name": "id5782194"
            }, {
                "uid": 7131005,
                "first_name": "Valery",
                "last_name": "Napolitano",
                "photo": "http://cs405631.userapi.com/v405631005/5403/34sO0bP9FQw.jpg",
                "photo_medium_rec": "http://cs405631.userapi.com/v405631005/5402/SPki4vRGUlM.jpg",
                "sex": 2,
                "online": 0,
                "screen_name": "groovywizard"
            }, {
                "uid": 8935126,
                "first_name": "Mitya",
                "last_name": "Ourside",
                "photo": "http://cs307912.userapi.com/v307912126/29ec/EtmqhJ169PY.jpg",
                "photo_medium_rec": "http://cs307912.userapi.com/v307912126/29eb/AjhS1Sua56A.jpg",
                "sex": 2,
                "online": 1,
                "screen_name": "metrofun"
            }, {
                "uid": 19709326,
                "first_name": "Mikola",
                "last_name": "Rudik",
                "photo": "http://cs323919.userapi.com/u19709326/e_7538c9fd.jpg",
                "photo_medium_rec": "http://cs323919.userapi.com/u19709326/d_415c6692.jpg",
                "sex": 2,
                "online": 1,
                "screen_name": "id19709326"
            },
            {
                "uid": 8935126,
                "first_name": "Митя",
                "last_name": "Ourside",
                "photo": "http://cs407031.userapi.com/u8935126/e_694062a8.jpg",
                "photo_medium_rec": "http://cs407031.userapi.com/u8935126/d_e6ffd3c8.jpg",
                "sex": 2,
                "online": 0,
                "screen_name": "metrofun"
            }, {
                "uid": 34193798,
                "first_name": "Sskey",
                "last_name": "Sskey",
                "photo": "http://cs10512.userapi.com/u34193798/e_81b2a6e8.jpg",
                "photo_medium_rec": "http://cs10512.userapi.com/u34193798/d_e65d80f9.jpg",
                "sex": 2,
                "online": 1,
                "screen_name": "id34193798"
            }, {
                "uid": 58033814,
                "first_name": "Александр",
                "last_name": "Куренёв",
                "photo": "http://cs9659.userapi.com/u58033814/e_89b90d3e.jpg",
                "photo_medium_rec": "http://cs9659.userapi.com/u58033814/d_2ef79f86.jpg",
                "sex": 2,
                "online": 0,
                "screen_name": "id58033814"
            }, {
                "uid": 43600757,
                "first_name": "Вася",
                "last_name": "Карасенко",
                "photo": "http://cs11459.userapi.com/u43600757/e_a3c87603.jpg",
                "photo_medium_rec": "http://cs11459.userapi.com/u43600757/d_19e300ef.jpg",
                "sex": 2,
                "online": 1,
                "screen_name": "id43600757"
            }],
            "groups": [{
                "gid": 12332522,
                "name": "Интересное Кино",
                "screen_name": "aboutkino",
                "is_closed": 0,
                "type": "group",
                "photo": "http://cs407920.userapi.com/g12332522/e_ce888f3a.jpg",
                "photo_medium": "http://cs407920.userapi.com/g12332522/d_4e0dadca.jpg",
                "photo_big": "http://cs407920.userapi.com/g12332522/a_eaafc357.jpg"
            }]
        },
        "time": 1350509179
    }
});

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

define(['backbone', 'underscore', 'request/request', 'mediator/mediator'],
    function (Backbone, _, request, Mediator, data) {
        return Backbone.Model.extend({
            defaults: {
                friends: new Backbone.Collection()
            },
            initialize: function () {
                request.api({
                    code: 'return API.friends.get({ fields : "photo,sex,nickname,lists" });'
                }).done(function (response) {
                    this.get('friends').add(response);
                }.bind(this));

                Mediator.sub('friends:view', function () {
                    Mediator.pub('friends:data', this.toJSON());
                }.bind(this));
            }
        });
    }
);

angular.module(
    'longpoll',
    ['request', 'mediator']
).run(function (Request, Mediator) {
    var LONG_POLL_WAIT = 5;

    function enableLongPollUpdates() {
        Request.api({
            code: 'return API.messages.getLongPollServer();'
        }).then(fetchUpdates, enableLongPollUpdates);
    }
    function fetchUpdates(params) {
        Request.get('http://' + params.server, {
            act: 'a_check',
            key:  params.key,
            ts: params.ts,
            wait: LONG_POLL_WAIT,
            mode: 2
        }, 'json').then(function (response) {
            if (!response.updates) {
                enableLongPollUpdates();
                return;
            } else if (response.updates.length) {
                Mediator.pub('longpoll:updates', response.updates);
            }

            params.ts = response.ts;
            fetchUpdates(params);
        }, enableLongPollUpdates);
    }

    enableLongPollUpdates();
});


/*jshint bitwise:false */
define([
    'underscore',
    'backbone',
    'request/request',
    'mediator/mediator'
], function (_, Backbone, request, Mediator) {
    var LONG_POLL_WAIT = 25;

    return Backbone.Model.extend({
        initialize: function (params) {
            var self = this;

            this.enableLongPollUpdates();
        },
        enableLongPollUpdates: function () {
            var self = this;
            request.api({
                code: 'return API.messages.getLongPollServer();'
            }).done(function (response) {
                self.params = response;
                self.fetchUpdates();
            });
        },
        fetchUpdates: function () {
            var self = this;

            request.get('http://' + this.params.server, {
                act: 'a_check',
                key:  this.params.key,
                ts: this.params.ts,
                wait: LONG_POLL_WAIT,
                mode: 2
            }, function (response) {
                var data = JSON.parse(jQuery.trim(response));

                if (!data.updates) {
                    self.enableLongPollUpdates();
                    return;
                } else {
                    Mediator.pub('longpoll:updates', data.updates);
                }

                self.params.ts = data.ts;
                self.fetchUpdates();
            }, 'text').fail(function () {
                self.enableLongPollUpdates();
            });
        }
    });
});

angular.module('mediator', [])
    .factory('Mediator', function () {
        var dispatcher = _.clone(Backbone.Events);

        chrome.extension.onMessage.addListener(function (messageData) {
            dispatcher.trigger.apply(dispatcher, messageData);
        });

        return {
            pub: function () {
                // dispatcher.trigger.apply(dispatcher, arguments);
                chrome.extension.sendMessage([].slice.call(arguments));
            },
            sub: function () {
                dispatcher.on.apply(dispatcher, arguments);
            },
            once: function () {
                dispatcher.once.apply(dispatcher, arguments);
            },
            unsub: function () {
                dispatcher.off.apply(dispatcher, arguments);
            }
        };
    });

define(['backbone', 'underscore', 'request/request', 'mediator/mediator'],
    function (Backbone, _, request, Mediator) {
        var
        MAX_ITEMS_COUNT = 50,
        UPDATE_ONLINE_INTERVAL = 30000;

        return Backbone.Model.extend({
            startTime: '0',
            defaults: {
                profiles: new Backbone.Collection(),
                groupItems: new Backbone.Collection(),
                friendItems: new Backbone.Collection()
            },
            updateOnlineStatus: _.debounce(function () {
                var uids = _.filter(this.get('friendItems').pluck('source_id'), function (sourceId) {
                    return sourceId > 0;
                });

                Mediator.pub('users:get', uids);
                Mediator.once('users:' + uids.join(), function handler(data) {
                    this.get('profiles').add(data);
                    this.updateOnlineStatus();
                }.bind(this));
            }, UPDATE_ONLINE_INTERVAL),
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
            },

            initialize: function () {
                request.api({
                    code: ['return { "news" : API.newsfeed.get({start_time: ',
                        this.startTime, ', "count" : "', MAX_ITEMS_COUNT,
                        '"}), "time" : API.getServerTime()};'].join('')
                }).done(function (response) {
                    this.normalizeResponse(response);

                    this.startTime = response.time;

                    this.get('profiles').add(response.news.profiles);
                    this.get('profiles').add(response.news.groups);
                    response.news.items.forEach(function (item) {
                        if (item.source_id > 0) {
                            this.get('friendItems').add(item);
                        } else {
                            this.get('groupItems').add(item);
                        }
                    }, this);
                }.bind(this));

                Mediator.sub('newsfeed:friends:get', function () {
                    Mediator.pub('newsfeed:friends', {
                        profiles: this.get('profiles').toJSON(),
                        items: this.get('friendItems').toJSON()
                    });
                }.bind(this));
                Mediator.sub('newsfeed:groups:get', function () {
                    Mediator.pub('newsfeed:groups', {
                        profiles: this.get('profiles').toJSON(),
                        items: this.get('groupItems').toJSON()
                    });
                }.bind(this));

                this.updateOnlineStatus();
            }
        });
    }
);

angular.module('newsfeed', ['mediator', 'request']).run(function (Request, Mediator) {
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
        groupItemsColl = new Backbone.Collection(),
        friendItemsColl = new Backbone.Collection();

    function fetchNewsfeed() {
        Request.api({code: [
            'return API.newsfeed.get({"count" : "', MAX_ITEMS_COUNT, '"});'
        ].join('')}).done(function (response) {
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
});

angular.module('persistent-set', []).factory('PersistentSet', function () {
    var constructor = function (name) {
        var item = localStorage.getItem(name);

        if (item) {
            this._set = JSON.parse(item);
        } else {
            this._set = [];
        }
        this._name = name;
    };
    constructor.prototype = {
        _save: function () {
            localStorage.setItem(
                this._name,
                JSON.stringify(this._set)
            );
        },
        toArray: function () {
            return this._set;
        },
        add: function (value) {
            if (!this.contains(value)) {
                this._set.push(value);
                this._save();
            }
        },
        contains: function (value) {
            return this._set.indexOf(value) !== -1;
        },
        remove: function (value) {
            var position = this._set.indexOf(value);
            if (position !== -1) {
                this._set.splice(position, 1);
                this._save();
            }
        },
        size: function () {
            return this._set.length;
        }
    };

    return constructor;
});

angular.module('request', ['mediator', 'auth']).factory(
    'Request',
    function (Auth, Mediator) {
        var
        API_QUERIES_PER_REQUEST = 15,
        API_DOMAIN = 'https://api.vk.com/',
        API_REQUESTS_DEBOUNCE = 400,
        API_VERSION = 5,

        apiQueriesQueue = [],
        Request = {
            /*
             * Makes ajax request and fails if login changed
             *
             * @param [Object] options See jQuery.ajax()
             *
             * @returns [jQuery.Deferred]
             */
            ajax: function (options) {
                return Auth.getAccessToken().then(function (accessToken) {
                    var usedAccessToken = accessToken,
                        ajaxDeferred = jQuery.Deferred();

                    jQuery.ajax(options).then(
                        function (response) {
                            Auth.getAccessToken().then(function (accessToken) {
                                if (accessToken === usedAccessToken) {
                                    ajaxDeferred.resolve.call(ajaxDeferred, response);
                                } else {
                                    ajaxDeferred.reject.call(ajaxDeferred, response);
                                }
                            });
                        },
                        function (response) {
                            console.log('wtf', arguments);
                            ajaxDeferred.reject.call(ajaxDeferred, response);
                        }
                    );
                    return ajaxDeferred;
                });
            },
            get: function (url, data, dataType) {
                return this.ajax({
                    method: 'GET',
                    url: url,
                    data: data,
                    dataType: dataType
                });
            },
            post: function (url, data, dataType) {
                return this.ajax({
                    method: 'POST',
                    url: url,
                    data: data,
                    dataType: dataType
                });
            },
            api: function (params) {
                var deferred = jQuery.Deferred();
                apiQueriesQueue.push({
                    params: params,
                    deferred: deferred
                });
                this.processApiQueries();
                return deferred;
            },
            processApiQueries: _.debounce(function () {
                if (apiQueriesQueue.length) {
                    var self = this, queriesToProcess = apiQueriesQueue.slice(0, API_QUERIES_PER_REQUEST),
                        executeCodeTokens = [], executeCode,  i, method, params;

                    apiQueriesQueue = apiQueriesQueue.slice(API_QUERIES_PER_REQUEST);
                    for (i = 0; i < queriesToProcess.length; i++) {
                        params = queriesToProcess[i].params;
                        method = params.method || 'execute';

                        if (params.method) {
                            method = params.method;
                            delete params.method;
                        }

                        if (method === 'execute') {
                            executeCodeTokens.push(params.code.replace(/^return\s*|;$/g, ''));
                        } else {
                            // TODO not implemented
                            throw 'not implemented';
                        }
                    }
                    executeCode = 'return [' + executeCodeTokens + '];';

                    Auth.getAccessToken().then(function (accessToken) {
                        self.post([API_DOMAIN, 'method/', method].join(''), {
                            method: 'execute',
                            code: executeCode,
                            access_token: accessToken,
                            v: API_VERSION
                        }).then(function (data) {
                            if (data.execute_errors) {
                                console.warn(data.execute_errors);
                            }
                            var response = data.response, i;
                            for (i = 0; i < response.length; i++) {
                                queriesToProcess[i].deferred.resolve(response[i]);
                            }
                            self.processApiQueries();
                        });
                    });
                }
            }, API_REQUESTS_DEBOUNCE)
        };

        // Mediator.sub('auth:success', function (data) {
            // accessToken = data.accessToken;
        // });
        Mediator.sub('request', function (params) {
            Request[params.method].apply(Request, params['arguments']).then(function () {
                Mediator.pub('request:' + params.id, {
                    method: 'resolve',
                    'arguments': [].slice.call(arguments)
                });
            }, function () {
                Mediator.pub('request:' + params.id, {
                    method: 'reject',
                    'arguments': [].slice.call(arguments)
                });
            });
        });

        return Request;
    });

define(['backbone'], function (Backbone) {
    return Backbone.Model.extend({
        initialize: function (attributes, options) {
            var data = localStorage.getItem(options.name);

            if (data) {
                this.set(JSON.parse(data));
            } else {
                this.set(attributes);
            }
            this.name = options.name;
            this.on('change', this.save.bind(this));
        },
        save: function () {
            console.log('save');
            localStorage.setItem(this.name, JSON.stringify(this.toJSON()));
        }
    });
});

define([
    'backbone',
    'underscore',
    'request/request',
    'mediator/mediator'
], function (Backbone, _, request, Mediator) {
    var DROP_PROFILES_INTERVAL = 30000,
        USERS_GET_DEBOUNCE = 400;

    return Backbone.Model.extend({
        usersGetQueue: [],
        defaults: {
            users: new (Backbone.Collection.extend({
                model: Backbone.Model.extend({
                    idAttribute: 'id'
                })
            }))()
        },
        initialize: function () {
            var self = this;

            this.dropOldNonFriendsProfiles();
            Mediator.sub('users:friends:get', function () {
                self.getFriendsProfiles().done(function (friendsProfiles) {
                    Mediator.pub('users:friends', friendsProfiles);
                });
            });
        },
        getFriendsProfiles: function () {
            if (!this._friendsProfilesDeferr) {
                this._friendsProfilesDeferr = request.api({
                    code: 'return API.friends.get({ fields : "photo,sex,nickname,lists", order: "hints" })'
                }).then(function (response) {
                    if (response && response.length) {
                        response.forEach(function (friendData) {
                            friendData.isFriend = true;
                        });
                        this.get('users').add(response);
                    }
                    return response;
                }.bind(this));
            }

            return this._friendsProfilesDeferr;
        },
        // TODO problem when dropped between onGet and response
        dropOldNonFriendsProfiles: _.debounce(function () {
            this.get('users').remove(this.get('users').filter(function (model) {
                return !model.get('isFriend');
            }));
            this.dropOldNonFriendsProfiles();
        }, DROP_PROFILES_INTERVAL),
        processGetUsersQueue: _.debounce(function () {
            var newUids = _.chain(this.usersGetQueue).pluck('uids').flatten()
                .unique().difference(this.get('users').pluck('uid'));

            if (newUids.length) {
                request.api({
                    // TODO limit for uids.length
                    code: 'return API.users.get({uids: "' + newUids.join() + '", fields : "online, photo,sex,nickname,lists"})'
                }).done(function (response) {
                    if (response && response.length) {
                        this.get('users').add(response);
                        this._publishUids();
                    }
                }.bind(this));
            } else {
                this._publishUids();
            }
        }, USERS_GET_DEBOUNCE),
        _publishUids: function () {
            var data, queueItem;

            function getUid(uid) {
                return _.clone(this.get('users').get(Number(uid)));
            }

            while (this.usersGetQueue.length) {
                queueItem = this.usersGetQueue.pop();
                data = queueItem.uids.map(getUid, this);

                if (data.length === 1) {
                    queueItem.resolve(data[0]);
                } else {
                    queueItem.resolve(data);
                }
            }
        },
        /**
         * Returns profiles by ids
         * @param [Array<<Number>>|Number] uids Array of user's uds
         *
         * @returns {jQuery.Deferred} Returns promise that will be fulfilled with profiles
         */
        getProfilesById: function (uids) {
            return this.getFriendsProfiles().then(function () {
                var deferr = new jQuery.Deferred();

                this.usersGetQueue.push({
                    uids: uids,
                    deferr: deferr
                });
                this.processGetUsersQueue();
            });
        }
    });
});

angular.module('users', ['request']).factory('Users', function (Request) {
    var
    DROP_PROFILES_INTERVAL = 30000,
    USERS_GET_DEBOUNCE = 400,

    usersColl = new (Backbone.Collection.extend({
        model: Backbone.Model.extend({
            idAttribute: 'id'
        })
    }))(),
    usersGetQueue = [],
    // TODO problem when dropped between onGet and response
    dropOldNonFriendsProfiles = _.debounce(function () {
        usersColl.remove(usersColl.filter(function (model) {
            return !model.get('isFriend');
        }));
        dropOldNonFriendsProfiles();
    }, DROP_PROFILES_INTERVAL),
    processGetUsersQueue = _.debounce(function () {
        var processedQueue = usersGetQueue,
            newUids = _.chain(processedQueue).pluck('uids').flatten()
            .unique().difference(usersColl.pluck('id')).value();

        // start new queue
        usersGetQueue = [];

        if (newUids.length) {
            Request.api({
                // TODO limit for uids.length
                code: 'return API.users.get({uids: "' + newUids.join() + '", fields : "online, photo,sex,nickname,lists"})'
            }).then(function (response) {
                if (response && response.length) {
                    usersColl.add(response);
                    publishUids(processedQueue);
                }
            }.bind(this));
        } else {
            publishUids(processedQueue);
        }
    }, USERS_GET_DEBOUNCE),
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
            data = queueItem.uids.map(getProfileById, this);

            if (data.length === 1) {
                queueItem.deferred.resolve(data[0]);
            } else {
                queueItem.deferred.resolve(data);
            }
        }
    };

    dropOldNonFriendsProfiles();


    return {
        getFriendsProfiles: function () {
            if (!this._friendsProfilesDefer) {
                this._friendsProfilesDefer = Request.api({
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

            return this._friendsProfilesDefer;
        },
        /**
         * Returns profiles by ids
         * @param [Array<<Number>>|Number] uids Array of user's uds
         *
         * @returns {jQuery.Deferred} Returns promise that will be fulfilled with profiles
         */
        getProfilesById: function (uids) {
            return this.getFriendsProfiles().then(function () {
                var deferred = jQuery.Deferred();

                usersGetQueue.push({
                    uids: uids,
                    deferred: deferred
                });
                processGetUsersQueue();
                return deferred;
            });
        }
    };
});
