angular.module('app', ['auth', 'buddies', 'chat', 'newsfeed', 'feedbacks']);

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
                'scope=friends,photos,audio,video,docs,notes,pages,wall,groups,messages,notifications',
                'response_type=token',
                'display=page'
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
    ['users', 'request', 'mediator', 'persistent-set', 'profiles-collection']
).run(function (Users, Request, Mediator, PersistentSet, ProfilesCollection) {
    var readyDeferred = jQuery.Deferred(),
        watchedBuddiesSet = new PersistentSet('watchedBuddies'),
        buddiesColl = new (ProfilesCollection.extend({
            model: Backbone.Model.extend({
                idAttribute: 'uid'
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
                'uid'
            )).then(function (profiles) {
                profiles.forEach(function (profile) {
                    profile.isFave = true;
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
    readyDeferred.then(function () {
        buddiesColl.on('change', function () {
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

/*jshint bitwise:false, latedef: false */
angular.module(
    'chat',
    ['request', 'mediator', 'persistent-set', 'auth', 'longpoll', 'profiles-collection']
).run(function (Users, Request, Mediator, Auth, ProfilesCollection) {
    var
    MAX_HISTORY_COUNT = 10,

    dialogColl = new (Backbone.Collection.extend({
        comparator: function (dialog) {
            var messages = dialog.get('messages');
            return - messages[messages.length - 1].date;
        }
    }))(),
    profilesColl = new ProfilesCollection(),
    userId, readyDeferred = jQuery.Deferred(),

    /**
     * Notifies about current state of module.
     * Has a tiny debounce to make only one publish per event loop
     */
    publishData = _.debounce(function publishData() {
        Mediator.pub('chat:data', {
            dialogs: dialogColl.toJSON(),
            profiles: profilesColl.toJSON()
        });
    }, 0);
    /**
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
            messageDeferred = jQuery.Deferred().resolve([1, {
                body: update[6],
                title: update[5],
                date: update[4],
                uid: out ? userId:dialogCompanionUid,
                read_state: +!(flags & 1),
                mid: messageId
                // out: +!!(flags & 2)
            }]);
        } else {
            messageDeferred = Request.api({
                code: 'return API.messages.getById({chat_active: 1, mid: ' + messageId + '});'
            });
        }

        messageDeferred.done(function (response) {
            var message = response[1],
                dialogId = message.chat_id ? 'chat_id_' + message.chat_id:'uid_' + dialogCompanionUid;

            dialog = dialogColl.get(dialogId);
            if (dialog) {
                dialog.get('messages').push(message);
                removeReadMessages(dialog);
            } else {
                // TODO add parse function and move this code into dialogColl
                dialogColl.add({
                    id: dialogId,
                    uid: dialogCompanionUid,
                    chat_id: message.chat_id,
                    chat_active: message.chat_active,
                    messages: [message]
                });

                setDialogsProfiles();
            }
        });
    }
    function setDialogsProfiles() {
        var uids = dialogColl.reduce(function (uids, dialog) {
            dialog.get('messages').map(function (message) {
                var chatActive = message.chat_active;
                if (chatActive) {
                    uids = uids.concat(chatActive.map(function (uid) {
                        return Number(uid);
                    })).concat(userId);
                } else {
                    uids = uids.concat([message.uid, dialog.get('uid')]);
                }
            });
            return uids;
        }, []);

        uids = _.uniq(uids);

        if (uids.length) {
            return Users.getProfilesById(uids).then(function (data) {
                profilesColl.reset(data);
            });
        } else {
            profilesColl.reset();
            return jQuery.Deferred().resolve();
        }
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
            if (message.mid !== dialogCompanionUid && message.read_state) {
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
                if (historyMessages && historyMessages[0]) {
                    unreadDialogs[index].set(
                        'messages',
                        historyMessages.slice(1).reverse().map(convertHistoryIntoMessageData)
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
                            if (message.mid === messageId) {
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
            if (response && response[0]) {
                dialogColl.reset(response.slice(1).map(function (item) {
                    // convert dialog data into message data
                    return {
                        id: item.chat_id ? 'chat_id_' + item.chat_id:'uid_' + item.uid,
                        chat_id: item.chat_id,
                        chat_active: item.chat_active,
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
        readyDeferred.then(publishData);
    });
    readyDeferred.then(function () {
        Mediator.sub('longpoll:updates', onUpdates);

        // Notify about changes
        dialogColl.on('change', function () {
            dialogColl.sort();
            publishData();
        });
        profilesColl.on('change', publishData);
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

var feedback_data = {
	"items": [10, {
		"type": "like_comment_video",
		"date": 1373538559,
		"parent": {
			"id": 4,
			"owner_id": 8935126,
			"date": 1373538551,
			"text": "??????????? ? ?????",
			"video": {
				"id": 150955304,
				"owner_id": 34193798,
				"title": "gde moi babulia :D:D:D",
				"description": "=))))))))<br>????????:<br>1. Eminem - Lose Yourself<br>2. Chamillionaire &amp; Krayzie Bone<br>3. Outkast - Hey Ya!<br>4. The Pussycat Dolls &amp; Busta Rhymes<br>5. MC Hummer - Can't Touch This<br>6. Nelly - Hot in Herre",
				"duration": 311,
				"link": "video150955304",
				"image": "http://video426.vkadre.ru/assets/thumbnails/ab8ea90480047748.160.vk.jpg",
				"image_medium": "http://video426.vkadre.ru/assets/thumbnails/ab8ea90480047748.320.vk.jpg",
				"date": 1284503415,
				"views": 1,
				"player": "http://vk.com/video_ext.php?oid=34193798&id=150955304&hash=823f473a14c4c888"
			}
		},
		"feedback": [{
			"owner_id": "34193798"
		}]
	},
	{
		"type": "reply_comment",
		"date": 1373538341,
		"parent": {
			"id": 830,
			"owner_id": 8935126,
			"date": 1373538317,
			"text": "???? ????",
			"post": {
				"id": 195,
				"from_id": 34193798,
				"to_id": 34193798,
				"date": 1289855948,
				"post_type": "post",
				"text": "dwaw",
				"attachments": [{
					"type": "photo",
					"photo": {
						"pid": 191182449,
						"aid": - 7,
						"owner_id": 34193798,
						"src": "http://cs10512.vk.me/u34193798/-7/m_92bb128e.jpg",
						"src_big": "http://cs10512.vk.me/u34193798/-7/x_eaa44328.jpg",
						"src_small": "http://cs10512.vk.me/u34193798/-7/s_56ecc3fe.jpg",
						"src_xbig": "http://cs10512.vk.me/u34193798/-7/y_2c90a76e.jpg",
						"text": "",
						"created": 1289855947,
						"post_id": 195,
						"access_key": "74f86f1252549d2729"
					}
				}],
				"comments": {
					"count": 0,
					"can_post": 1
				},
				"likes": {
					"count": 1,
					"user_likes": 0,
					"can_like": 1,
					"can_publish": 1
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
			"cid": 832,
			"uid": 34193798,
			"from_id": 34193798,
			"date": 1289855948,
			"text": "[id8935126|????], ???123??",
			"reply_to_uid": 8935126,
			"reply_to_cid": 830,
			"likes": {
				"count": 0,
				"user_likes": 0
			}
		}
	},
	{
		"type": "like_comment",
		"date": 1373538331,
		"parent": {
			"id": 830,
			"owner_id": 8935126,
			"date": 1373538317,
			"text": "???? ????",
			"post": {
				"id": 195,
				"from_id": 34193798,
				"to_id": 34193798,
				"date": 1289855948,
				"post_type": "post",
				"text": "dwaw",
				"attachments": [{
					"type": "photo",
					"photo": {
						"pid": 191182449,
						"aid": - 7,
						"owner_id": 34193798,
						"src": "http://cs10512.vk.me/u34193798/-7/m_92bb128e.jpg",
						"src_big": "http://cs10512.vk.me/u34193798/-7/x_eaa44328.jpg",
						"src_small": "http://cs10512.vk.me/u34193798/-7/s_56ecc3fe.jpg",
						"src_xbig": "http://cs10512.vk.me/u34193798/-7/y_2c90a76e.jpg",
						"text": "",
						"created": 1289855947,
						"post_id": 195,
						"access_key": "74f86f1252549d2729"
					}
				}],
				"comments": {
					"count": 0,
					"can_post": 1
				},
				"likes": {
					"count": 1,
					"user_likes": 0,
					"can_like": 1,
					"can_publish": 1
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
			"owner_id": "34193798"
		}]
	},
	{
		"type": "like_comment_topic",
		"date": 1373490169,
		"parent": {
			"id": 25,
			"owner_id": 8935126,
			"date": 1373489990,
			"text": "123123123",
			"topic": {
				"tid": 24472010,
				"owner_id": - 22927788,
				"title": "????",
				"created": 1299329447,
				"created_by": 101,
				"updated": 1373532053,
				"updated_by": 8935126,
				"is_closed": 0,
				"is_fixed": 0,
				"comments": 26
			}
		},
		"feedback": [{
			"owner_id": "34193798"
		}]
	},
	{
		"type": "reply_topic",
		"date": 1373489404,
		"parent": {
			"id": 24472010,
			"owner_id": - 22927788,
			"title": "????",
			"created": 1299329447,
			"created_by": 8935126,
			"updated": 1373532053,
			"updated_by": 8935126,
			"is_closed": 0,
			"is_fixed": 0,
			"comments": 26
		},
		"feedback": {
			"owner_id": 34193798,
			"id": "24",
			"text": "[id8935126:bp-22927788_22|????], ???????",
			"date": 1373484930,
			"likes": {
				"count": 0,
				"user_likes": 0
			}
		}
	},
	{
		"type": "follow",
		"date": 1373486628,
		"feedback": [{
			"owner_id": "144710290"
		}]
	},
	{
		"type": "like_post",
		"date": 1373447664,
		"parent": {
			"id": 6318,
			"from_id": 8935126,
			"to_id": 8935126,
			"date": 1369411868,
			"post_type": "post",
			"text": "",
			"attachments": [{
				"type": "audio",
				"audio": {
					"aid": 209421951,
					"owner_id": 8935126,
					"performer": "Mika",
					"title": "Relax (Take it easy)",
					"duration": 227
				}
			}],
			"comments": {
				"count": 0,
				"can_post": 1
			},
			"likes": {
				"count": 6,
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
			"owner_id": "34193798"
		}]
	},
	{
		"type": "copy_post",
		"date": 1373447557,
		"parent": {
			"id": 6318,
			"from_id": 8935126,
			"to_id": 8935126,
			"date": 1369411868,
			"post_type": "post",
			"text": "",
			"attachments": [{
				"type": "audio",
				"audio": {
					"aid": 209421951,
					"owner_id": 8935126,
					"performer": "Mika",
					"title": "Relax (Take it easy)",
					"duration": 227
				}
			}],
			"comments": {
				"count": 0,
				"can_post": 1
			},
			"likes": {
				"count": 6,
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
			"owner_id": "34193798",
			"id": "827"
		},
		{
			"owner_id": "34193798",
			"id": "826"
		}]
	},
	{
		"type": "like_photo",
		"date": 1373393987,
		"parent": {
			"pid": 285073023,
			"aid": - 6,
			"owner_id": 8935126,
			"src": "http://cs307912.vk.me/v307912126/673/iblXJg9BdoE.jpg",
			"src_big": "http://cs307912.vk.me/v307912126/674/6BC64JgXKso.jpg",
			"src_small": "http://cs307912.vk.me/v307912126/672/9ZzoF6XBz8s.jpg",
			"src_xbig": "http://cs307912.vk.me/v307912126/675/l3j73i60sWM.jpg",
			"src_xxbig": "http://cs307912.vk.me/v307912126/676/Jv0qW91-LXk.jpg",
			"src_xxxbig": "http://cs307912.vk.me/v307912126/677/u0mh0UrNqDM.jpg",
			"width": 1370,
			"height": 2048,
			"text": "",
			"created": 1342473196,
			"post_id": 6127
		},
		"feedback": [{
			"owner_id": "213730677"
		}]
	},
	{
		"type": "like_comment",
		"date": 1372788242,
		"parent": {
			"id": 5472,
			"owner_id": 8935126,
			"date": 1372102097,
			"text": "[id156919940|Igor], ? ????? ??????? ? ?????? ????? ??????? ???????????, ??????? ?????? ?? ???????. ? ??????? ??????????, ?????????? ??????? ????? ??????",
			"reply_to_uid": 156919940,
			"reply_to_cid": 5468,
			"post": {
				"id": 5466,
				"from_id": 132443132,
				"to_id": - 10959001,
				"date": 1371938614,
				"post_type": "post",
				"text": "???????? ???????? ??????- ???????",
				"comments": {
					"count": 0,
					"can_post": 1
				},
				"likes": {
					"count": 3,
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
			"owner_id": "173684991"
		}]
	}],
	"profiles": [{
		"uid": 101,
		"first_name": "?????????????",
		"last_name": "",
		"sex": 0,
		"screen_name": "id101",
		"photo": "https://vk.com/images/camera_c.gif",
		"photo_medium_rec": "https://vk.com/images/camera_b.gif",
		"online": 0
	},
	{
		"uid": 8935126,
		"first_name": "????",
		"last_name": "?????",
		"sex": 2,
		"screen_name": "metrofun",
		"photo": "http://cs307912.vk.me/v307912126/29ec/EtmqhJ169PY.jpg",
		"photo_medium_rec": "http://cs307912.vk.me/v307912126/29eb/AjhS1Sua56A.jpg",
		"online": 1
	},
	{
		"uid": 34193798,
		"first_name": "Sskey",
		"last_name": "Sskey",
		"sex": 2,
		"screen_name": "id34193798",
		"photo": "http://cs10512.vk.me/u34193798/e_81b2a6e8.jpg",
		"photo_medium_rec": "http://cs10512.vk.me/u34193798/d_e65d80f9.jpg",
		"online": 1
	},
	{
		"uid": 132443132,
		"first_name": "?????",
		"last_name": "????????",
		"sex": 1,
		"screen_name": "id132443132",
		"photo": "http://cs323617.vk.me/v323617132/7a5b/PIePPfXte2E.jpg",
		"photo_medium_rec": "http://cs323617.vk.me/v323617132/7a5a/OcFatxgCDig.jpg",
		"online": 0
	},
	{
		"uid": 144710290,
		"first_name": "?????????",
		"last_name": "??????",
		"sex": 1,
		"screen_name": "id144710290",
		"photo": "http://cs412430.vk.me/v412430290/f69/gK27qmL7XK8.jpg",
		"photo_medium_rec": "http://cs412430.vk.me/v412430290/f68/Ocng6bx7H_U.jpg",
		"online": 0
	},
	{
		"uid": 156919940,
		"first_name": "?????",
		"last_name": "????????",
		"sex": 2,
		"screen_name": "id156919940",
		"photo": "http://cs306201.vk.me/v306201940/6ab7/3T4HsSt7K9k.jpg",
		"photo_medium_rec": "http://cs306201.vk.me/v306201940/6ab6/Xcw2Mc0Ikls.jpg",
		"online": 0
	},
	{
		"uid": 173684991,
		"first_name": "?????????",
		"last_name": "?????????",
		"sex": 1,
		"screen_name": "id173684991",
		"photo": "http://cs9423.vk.me/v9423991/1715/5eka0qfx75Y.jpg",
		"photo_medium_rec": "http://cs9423.vk.me/v9423991/1714/8x8XtjnPyYk.jpg",
		"online": 1
	},
	{
		"uid": 213730677,
		"first_name": "???????",
		"last_name": "???????????",
		"sex": 1,
		"screen_name": "n_a_n_a99",
		"photo": "https://vk.com/images/camera_c.gif",
		"photo_medium_rec": "https://vk.com/images/camera_b.gif",
		"online": 0
	}],
	"groups": [{
		"gid": 10959001,
		"name": "VKfox -?????? ?????? ??? ?????????",
		"screen_name": "plugin_vkfox",
		"is_closed": 0,
		"is_admin": 1,
		"admin_level": 3,
		"is_member": 1,
		"type": "group",
		"photo": "http://cs4481.vk.me/g10959001/e_0dc0bfbb.jpg",
		"photo_medium": "http://cs4481.vk.me/g10959001/d_eaa60e19.jpg",
		"photo_big": "http://cs4481.vk.me/g10959001/a_91e2150e.jpg"
	},
	{
		"gid": 22927788,
		"name": "ForTesting",
		"screen_name": "club22927788",
		"is_closed": 0,
		"is_admin": 1,
		"admin_level": 3,
		"is_member": 0,
		"type": "page",
		"photo": "https://vk.com/images/community_50.gif",
		"photo_medium": "https://vk.com/images/community_100.gif",
		"photo_big": "https://vk.com/images/question_a.gif"
	}],
	"new_from": "#0",
	"new_offset": 0
}

angular.module(
    'feedbacks',
    ['mediator', 'request', 'likes', 'profiles-collection']
).run(function (Request, Mediator, ProfilesCollection) {
    var
    MAX_ITEMS_COUNT = 50,
    UPDATE_PERIOD = 1000,

    readyDeferred = jQuery.Deferred(),
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
    autoUpdateNotificationsParams = {
        count: MAX_ITEMS_COUNT,
        //everything except comments
        filters: "'wall', 'mentions', 'likes', 'reposts', 'followers', 'friends'"
    },
    autoUpdateCommentsParams = {
        last_comments: 1,
        count: MAX_ITEMS_COUNT
    },
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
     * Processes raw comments item and adds it to itemsColl,
     * doesn't sort itemsColl
     *
     * @param {Object} item
     */
    function addRawCommentsItem(item) {
        var parentType = item.type,
            parent = item, itemModel, itemID;

        parent.owner_id = Number(parent.from_id || parent.source_id);
        itemID  = generateItemID(parentType, parent);
        if (!(itemModel = itemsColl.get(itemID))) {
            itemModel = createItemModel(parentType, parent, true);
            itemsColl.add(itemModel, {sort: false});
        }
        if (!itemModel.has('date') || itemModel.get('date') < item.date) {
            itemModel.set('date', _.last(item.comments.list).date);
        }
        itemModel.get('feedbacks').add(item.comments.list.map(function (feedback) {
            feedback.owner_id = Number(feedback.from_id);
            return {
                id: generateItemID('comment', feedback),
                type: 'comment',
                feedback: feedback,
                date: feedback.date
            };
        }));
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

        if (item.type.indexOf('_') !== -1) {
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
            if (!itemModel.has('date') || itemModel.get('date') < item.date) {
                itemModel.set('date', item.date);
            }
            itemModel.get('feedbacks').add([].concat(feedback).map(function (feedback) {
                feedback.owner_id = Number(feedback.from_id || feedback.owner_id);
                return {
                    id: generateItemID(feedbackType, feedback),
                    type: feedbackType,
                    feedback: feedback,
                    date: item.date
                };
            }));
        } else {
            //follows types are array
            [].concat(feedback).forEach(function (feedback) {
                var itemModel;
                feedback.owner_id = Number(feedback.owner_id || feedback.from_id);
                itemModel = createItemModel(parentType, feedback, false);
                itemModel.set('date', item.date);
                itemsColl.add(itemModel);
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
            autoUpdateNotificationsParams.from = notifications.new_from;
            autoUpdateCommentsParams.start_time = response.time;
            autoUpdateCommentsParams.from = comments.new_from;

            // first item in notifications contains quantity
            if ((notifications.items && notifications.length > 1)
                || (comments.items && comments.items.length)) {
                // TODO comments
                profilesColl
                    .add(comments.profiles, {parse: true})
                    .add(comments.groups, {parse: true})
                    .add(notifications.profiles, {parse: true})
                    .add(notifications.groups, {parse: true});

                notifications.items.slice(1).forEach(addRawNotificationsItem);
                comments.items.forEach(addRawCommentsItem);
                itemsColl.sort();
                console.log(response);
            }
            readyDeferred.resolve();
            setTimeout(fetchFeedbacks, UPDATE_PERIOD);
        });
    }

    fetchFeedbacks();

    readyDeferred.then(function () {
        Mediator.sub('likes:changed', function (params) {
            itemsColl.some(function (model) {
                var parent  = model.get('parent'),
                    matches = false;

                matches = (parent.to_id === params.owner_id)
                    && (params.type === parent.post_type  || params.type === model.get('type'))
                    && (parent.id === params.item_id);

                if (matches) {
                    parent.likes = params.likes;
                    itemsColl.trigger('change');
                }
            });
        });
    });

    Mediator.sub('feedbacks:data:get', function () {
        readyDeferred.then(publishData);
    });

    // Notify about changes
    readyDeferred.then(function () {
        itemsColl.on('change sort', publishData);
        profilesColl.on('change', publishData);
    });
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
    'likes',
    ['request', 'mediator']
).run(function (Request, Mediator) {
    /**
     * @param [Object] params
     * @param [String] params.action 'delete' or 'add'
     * @param [String] params.type 'post', 'comment' etc
     * @param [Number] params.owner_id
     * @param [Number] params.item_id
     */
    Mediator.sub('likes:change', function (params) {
        var action = params.action;

        delete params.action;

        console.log(params);
        Request.api({
            code: 'return API.likes.' + action + '(' + JSON.stringify(params) + ');'
        }).then(function (response) {
            Mediator.pub('likes:changed', _.extend(params, {
                likes: {
                    count: response.likes,
                    user_likes: action === 'delete' ? 0:1,
                    can_like: action === 'delete' ? 1:0
                }
            }));
        });

    });
});


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

angular.module(
    'profiles-collection',
    ['request', 'mediator', 'longpoll', 'users']
).factory('ProfilesCollection', function (Request, Mediator, Users) {
    var UPDATE_NON_FRIENDS_PERIOD = 1000;

    return Backbone.Collection.extend({
        initialize: function () {
            Mediator.sub('longpoll:updates', this._onFriendUpdates.bind(this));

            this._updateNonFriends();
        },
        _updateNonFriends: function () {
            var
            self = this,
            uids = this.where({
                isFriend: undefined,
                // don't select groups profiles
                gid: undefined
            }).map(function (model) {
                return model.get('uid');
            });

            if (uids.length) {
                Users.getProfilesById(uids).then(function (profiles) {
                    profiles.forEach(function (profile) {
                        var model = self.get(profile.uid);
                        if (model) {
                            model.set('online', profile.online);
                        }
                    });
                });
            }

            setTimeout(this._updateNonFriends.bind(this), UPDATE_NON_FRIENDS_PERIOD);
        },
        /**
         * @see http://vk.com/developers.php?oid=-17680044&p=Connecting_to_the_LongPoll_Server
         *
         * @param [Array] updates
         */
        _onFriendUpdates: function (updates) {
            updates.forEach(function (update) {
                var type = update[0],
                    userId = Math.abs(update[1]), model;

                // 8,-$user_id,0 -- друг $user_id стал онлайн
                // 9,-$user_id,$flags -- друг $user_id стал оффлайн
                // ($flags равен 0, если пользователь покинул сайт (например, нажал выход) и 1,
                // если оффлайн по таймауту (например, статус away))
                if (type === 9 || type === 8) {
                    model = this.get(Number(userId));
                    if (model) {
                        model.set('online', Number(type === 8));
                    }
                }
            }, this);
        }
    });
});

angular.module('request', ['mediator', 'auth']).factory(
    'Request',
    function (Auth, Mediator) {
        var
        API_QUERIES_PER_REQUEST = 15,
        API_DOMAIN = 'https://api.vk.com/',
        API_REQUESTS_DEBOUNCE = 400,
        API_VERSION = 4.99,

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
    DROP_PROFILES_INTERVAL = 500,
    USERS_GET_DEBOUNCE = 400,

    inProgress = false,
    usersColl = new (Backbone.Collection.extend({
        model: Backbone.Model.extend({
            idAttribute: 'uid'
        })
    }))(),
    usersGetQueue = [],
    dropOldNonFriendsProfiles = _.debounce(function () {
        if (!inProgress) {
            usersColl.remove(usersColl.filter(function (model) {
                return !model.get('isFriend');
            }));
        }
        dropOldNonFriendsProfiles();
    }, DROP_PROFILES_INTERVAL),
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
                code: 'return API.users.get({uids: "' + newUids.join() + '", fields : "online, photo,sex,nickname,lists"})'
            }).then(function (response) {
                if (response && response.length) {
                    usersColl.add(response);
                    publishUids(processedQueue);
                    inProgress = false;
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
            data = queueItem.uids.map(function (uid) {
                return getProfileById(uid).toJSON();
            });

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
