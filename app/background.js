// TODO rename to utils
angular.module('common', ['config', 'i18n'])
    .filter('duration', function () {
        /**
        * Returns time duration in format 'HH:mm'
        *
        * @param {Array} seconds
        *
        * @returns {String}
        */
        return function (seconds) {
            if (seconds) {
                return moment.unix(seconds).format('HH:mm');
            }
        };
    })
    .filter('where', function () {
        /**
         * Returns object from collection,
         * by it's key/value pair
         *
         * @param {Array} input
         * @param {String} property
         * @param {Mixed} value
         *
         * @returns {Object}
         */
        return function (input, property, value) {
            var obj;
            if (input) {
                obj  = {};
                obj[property] = value;
                return _(input).findWhere(obj);
            }
        };
    })
    .filter('name', function () {
        /**
         * Returns names from profile's data
         *
         * @param {Object|Array} input
         *
         * @returns {String} String
         */
        return function (input) {
            if (input) {
                return [].concat(input).map(function (owner) {
                    //group profile
                    if (owner.name) {
                        return owner.name;
                    //user profile
                    } else {
                        return owner.first_name + ' ' + owner.last_name;
                    }
                }).join(', ');
            }
        };
    })
    .filter('addVKBase', function (VK_BASE) {
        return function (path) {
            if (path.indexOf(VK_BASE) === -1) {
                if (path.charAt(0) === '/') {
                    path = path.substr(1);
                }
                path = VK_BASE + path;
            }
            return path;
        };
    })
    .filter('slice', function () {
        return function (arr, start, end) {
            if (arr) {
                return arr.slice(start, end);
            }
        };
    })
    .filter('isArray', function () {
        return function (input) {
            return angular.isArray(input);
        };
    });

angular.module('config', [])
    .constant('VK_BASE', 'http://vk.com/');

/*global i18n */
angular.module('i18n', [])
    .config(function ($filterProvider) {
        $filterProvider.register('i18n', function () {
            var DEFAULT_LANGUAGE = 'ru',
                language = navigator.language.split('_')[0],
                messages;

            messages = i18n[language];

            if (!messages) {
                messages = i18n[DEFAULT_LANGUAGE];
            }

            return function (input) {
                if (input) {
                    return messages[input].apply(
                        messages,
                        [].slice.call(arguments, 1)
                    );
                }
            };
        });
    });

(function(){ window.i18n || (window.i18n = {}) 
var MessageFormat = { locale: {} };
MessageFormat.locale.ru = function (n) {
  if ((n % 10) == 1 && (n % 100) != 11) {
    return 'one';
  }
  if ((n % 10) >= 2 && (n % 10) <= 4 &&
      ((n % 100) < 12 || (n % 100) > 14) && n == Math.floor(n)) {
    return 'few';
  }
  if ((n % 10) === 0 || ((n % 10) >= 5 && (n % 10) <= 9) ||
      ((n % 100) >= 11 && (n % 100) <= 14) && n == Math.floor(n)) {
    return 'many';
  }
  return 'other';
};

window.i18n["ru"] = {}
window.i18n["ru"]["chat"] = function(d){
var r = "";
r += "чат";
return r;
}
window.i18n["ru"]["news"] = function(d){
var r = "";
r += "новости";
return r;
}
window.i18n["ru"]["buddies"] = function(d){
var r = "";
r += "люди";
return r;
}
window.i18n["ru"]["my"] = function(d){
var r = "";
r += "мои";
return r;
}
window.i18n["ru"]["friends_nominative"] = function(d){
var r = "";
r += "друзей";
return r;
}
window.i18n["ru"]["groups_nominative"] = function(d){
var r = "";
r += "групп";
return r;
}
window.i18n["ru"]["Private message"] = function(d){
var r = "";
r += "Личное сообщение";
return r;
}
window.i18n["ru"]["Wall post"] = function(d){
var r = "";
r += "Сообщение на стене";
return r;
}
window.i18n["ru"]["Search"] = function(d){
var r = "";
r += "Имя или Фамилия";
return r;
}
window.i18n["ru"]["Male"] = function(d){
var r = "";
r += "Мужчины";
return r;
}
window.i18n["ru"]["Female"] = function(d){
var r = "";
r += "Женщины";
return r;
}
window.i18n["ru"]["Offline"] = function(d){
var r = "";
r += "Не в сети";
return r;
}
window.i18n["ru"]["Bookmarked"] = function(d){
var r = "";
r += "В закладках";
return r;
}
window.i18n["ru"]["Monitor online status"] = function(d){
var r = "";
r += "Следить за онлайн статусом";
return r;
}
window.i18n["ru"]["Mark as read"] = function(d){
var r = "";
r += "Отметить прочитанным";
return r;
}
window.i18n["ru"]["Like"] = function(d){
var r = "";
r += "Нравится";
return r;
}
window.i18n["ru"]["more..."] = function(d){
var r = "";
r += "далee";
return r;
}
window.i18n["ru"]["Comment"] = function(d){
var r = "";
r += "Комментировать";
return r;
}
window.i18n["ru"]["Liked"] = function(d){
var r = "";
r += "Понравилось";
return r;
}
window.i18n["ru"]["Reposted"] = function(d){
var r = "";
r += "Поделился записью";
return r;
}
window.i18n["ru"]["New friends:"] = function(d){
var r = "";
r += "Новые друзья:";
return r;
}
window.i18n["ru"]["started following you"] = function(d){
var r = "";
r += "хочет добавить в друзья";
return r;
}
window.i18n["ru"]["friend request accepted"] = function(d){
var r = "";
r += "заявка в друзья подтверждена";
return r;
}
window.i18n["ru"]["sent a message"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
r += d["NAME"];
r += " ";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "прислал";
return r;
},
"female" : function(d){
var r = "";
r += "прислала";
return r;
},
"other" : function(d){
var r = "";
r += "прислал";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " сообщение";
return r;
}
window.i18n["ru"]["is online"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "появился";
return r;
},
"female" : function(d){
var r = "";
r += "появилась";
return r;
},
"other" : function(d){
var r = "";
r += "появился";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " в сети";
return r;
}
window.i18n["ru"]["went offline"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "вышел";
return r;
},
"female" : function(d){
var r = "";
r += "вышла";
return r;
},
"other" : function(d){
var r = "";
r += "вышел";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " из сети";
return r;
}
window.i18n["ru"]["left a comment"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
r += d["NAME"];
r += " ";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "оставил";
return r;
},
"female" : function(d){
var r = "";
r += "оставила";
return r;
},
"other" : function(d){
var r = "";
r += "оставил";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " комментарий";
return r;
}
window.i18n["ru"]["mentioned you"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "упомянул";
return r;
},
"female" : function(d){
var r = "";
r += "упомянула";
return r;
},
"other" : function(d){
var r = "";
r += "упомянул";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вас";
return r;
}
window.i18n["ru"]["posted on your wall"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "написал";
return r;
},
"female" : function(d){
var r = "";
r += "написала";
return r;
},
"other" : function(d){
var r = "";
r += "написал";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " на стене";
return r;
}
window.i18n["ru"]["liked your comment"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "оценил";
return r;
},
"female" : function(d){
var r = "";
r += "оценила";
return r;
},
"other" : function(d){
var r = "";
r += "оценил";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " ваш комментарий";
return r;
}
window.i18n["ru"]["liked your post"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "оценил";
return r;
},
"female" : function(d){
var r = "";
r += "оценила";
return r;
},
"other" : function(d){
var r = "";
r += "оценил";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вашу запись";
return r;
}
window.i18n["ru"]["liked your photo"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "оценил";
return r;
},
"female" : function(d){
var r = "";
r += "оценила";
return r;
},
"other" : function(d){
var r = "";
r += "оценил";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " ваше фото";
return r;
}
window.i18n["ru"]["liked your video"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "оценил";
return r;
},
"female" : function(d){
var r = "";
r += "оценила";
return r;
},
"other" : function(d){
var r = "";
r += "оценил";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " ваше видео";
return r;
}
window.i18n["ru"]["shared your post"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "поделился";
return r;
},
"female" : function(d){
var r = "";
r += "поделилась";
return r;
},
"other" : function(d){
var r = "";
r += "поделился";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вашей записью";
return r;
}
window.i18n["ru"]["shared your photo"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "поделился";
return r;
},
"female" : function(d){
var r = "";
r += "поделилась";
return r;
},
"other" : function(d){
var r = "";
r += "поделился";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вашим фото";
return r;
}
window.i18n["ru"]["shared your video"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "поделился";
return r;
},
"female" : function(d){
var r = "";
r += "поделилась";
return r;
},
"other" : function(d){
var r = "";
r += "поделился";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вашим видео";
return r;
}
})();
angular.module('persistent-model', []).factory('PersistentModel', function () {
    return Backbone.Model.extend({
        /**
         * Stores and restores model from localStorage.
         * Requires 'name' in options, for localStorage key name
         *
         * @param {Object} attributes
         * @param {Object} options
         * @param {String} options.name
         */
        initialize: function (attributes, options) {
            var item;

            this._name = options.name;
            item = localStorage.getItem(this._name);

            if (item) {
                this.set(JSON.parse(item), {
                    silent: true
                });
            }

            this.on('change', this._save.bind(this));
        },
        _save: function () {
            localStorage.setItem(this._name, JSON.stringify(this.toJSON()));
        }
    });
});

angular.module('app', ['auth', 'buddies', 'chat', 'newsfeed', 'feedbacks']);

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
                'redirect_uri=http://oauth.vk.com/blank.html',
                'display=page'
            ].join('&')
        ].join(''),
        CREATED = 1,
        IN_PROGRESS = 1,
        READY = 2,

        $iframe, model = new Backbone.Model(),
        state = CREATED, authDeferred = jQuery.Deferred();

    // FIXME http://code.google.com/p/chromium/issues/detail?id=63122
    // chrome.extension.onRequest.addListener(function () {});

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

    /**
     * Removes all cookies for auth domain
     */
    function resetAuthCookies() {
        chrome.cookies.getAll({domain: AUTH_DOMAIN}, function (cookieArray) {
            var i, cookie;
            // remove each cookie
            for (i = 0; i < cookieArray.length; ++i) {
                cookie = cookieArray[i];
                console.log(cookie);
                chrome.cookies.remove({ name: cookie.name, url: cookie.path });
            }
        });
    }

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

                resetAuthCookies();

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

if (window.name === 'vkfox-login-iframe') {
    chrome.extension.sendMessage(['auth:iframe', decodeURIComponent(window.location.href)]);
}

angular.module('buddies', [
    'users',
    'request',
    'mediator',
    'persistent-set',
    'profiles-collection',
    'notifications'
]).run(function (Users, Request, Mediator, PersistentSet, ProfilesCollection, Notifications, $filter) {
    var readyDeferred,
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
     * Initialize all state
     */
    function initialize() {
        if (!readyDeferred || readyDeferred.state() === 'resolved') {
            if (readyDeferred) {
                readyDeferred.reject();
            }
            readyDeferred = jQuery.Deferred();
        }
        readyDeferred.then(function () {
            Mediator.pub('buddies:data', buddiesColl.toJSON());
        });
    }
    initialize();

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

    // entry point
    Mediator.sub('auth:success', function () {
        initialize();

        jQuery.when(
            Users.getFriendsProfiles(),
            getFavouriteUsers()
        ).then(function (friends, favourites) {
            buddiesColl.reset([].concat(favourites, friends));

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
    });

    Mediator.sub('buddies:data:get', function () {
        readyDeferred.then(function () {
            Mediator.pub('buddies:data', buddiesColl.toJSON());
        });
    });

    readyDeferred.then(function () {
        buddiesColl.on('change', function (model) {
            var profile = model.toJSON(), gender;

            // Notify about watched buddies
            if (profile.isWatched && model.changed.hasOwnProperty('online')) {
                gender = profile.sex === 1 ? 'female':'male';

                Notifications.create('buddies', {
                    title: $filter('name')(profile),
                    message: $filter('i18n')(
                        profile.online ? 'is online':'went offline',
                        {GENDER: gender}
                    ),
                    image: model.get('photo')
                });
            }
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

/*jshint bitwise:false, latedef: false */
angular.module('chat', [
    'request',
    'mediator',
    'persistent-set',
    'auth',
    'longpoll',
    'profiles-collection',
    'notifications',
    'i18n',
    'common',
    'persistent-model'
]).run(function (Users, Request, Mediator, Auth, ProfilesCollection, Notifications, PersistentModel, $filter) {
    var
    MAX_HISTORY_COUNT = 10,

    dialogColl = new (Backbone.Collection.extend({
        comparator: function (dialog) {
            var messages = dialog.get('messages');
            return - messages[messages.length - 1].date;
        }
    }))(),
    profilesColl = new (ProfilesCollection.extend({
        model: Backbone.Model.extend({
            idAttribute: 'uid'
        })
    }))(),
    persistentModel, userId,
    readyDeferred = jQuery.Deferred(),

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
     * Initialize all internal state
     */
    function initialize() {
        dialogColl.reset();
        profilesColl.reset();

        if (!readyDeferred || readyDeferred.state() === 'resolved') {
            if (readyDeferred) {
                readyDeferred.reject();
            }
            readyDeferred = jQuery.Deferred();
        }
        readyDeferred.then(function () {
            persistentModel = new PersistentModel({}, {
                name: ['chat', 'background', userId].join(':')
            });

            persistentModel.on('change:latestMessageId', function () {
                var messages = dialogColl.first().get('messages'),
                    message = messages[messages.length - 1],
                    profile, gender;

                if (!message.out) {
                    try {
                        profile = profilesColl.get(message.uid).toJSON();
                    } catch (e) {
                        debugger;
                    }
                    gender = profile.sex === 1 ? 'female':'male';

                    Notifications.create('chat', {
                        title: $filter('i18n')('sent a message', {
                            NAME: $filter('name')(profile),
                            GENDER: gender
                        }),
                        message: message.body,
                        image: profile.photo
                    });
                }
            });
            publishData();
        });
    }

    /**
     * @param {Object} update Update object from long poll
     */
    function addNewMessage(update) {
        var messageId = update[1],
            flags = update[2],
            attachment = update[7],
            dialog, messageDeferred,
            dialogCompanionUid = update[3];

        // For messages from chat attachment contains "from" property
        if (_(attachment).isEmpty()) {

            // mimic response from server
            messageDeferred = jQuery.Deferred().resolve([1, {
                body: update[6],
                title: update[5],
                date: update[4],
                uid: dialogCompanionUid,
                read_state: +!(flags & 1),
                mid: messageId,
                out: +!!(flags & 2)
            }]);
        } else {
            messageDeferred = Request.api({
                code: 'return API.messages.getById({chat_active: 1, mid: ' + messageId + '});'
            });
        }

        messageDeferred.then(function (response) {
            var message = response[1],
                dialogId = message.chat_id ? 'chat_id_' + message.chat_id:'uid_' + dialogCompanionUid;

            dialog = dialogColl.get(dialogId);
            if (dialog) {
                dialog.get('messages').push(message);
                removeReadMessages(dialog);
                dialog.trigger('change');

                return message;
            } else {
                // TODO add parse function and move this code into dialogColl
                dialogColl.add({
                    id: dialogId,
                    uid: dialogCompanionUid,
                    chat_id: message.chat_id,
                    chat_active: message.chat_active,
                    messages: [message]
                });

                return fetchProfiles().then(function () {
                    return message;
                });
            }
        });
    }
    function fetchProfiles() {
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

        uids.push(userId);
        uids = _.uniq(uids);

        return Users.getProfilesById(uids).then(function (data) {
            profilesColl.reset(data);
            // mark self profile
            profilesColl.get(userId).set('isSelf', true);
        });
    }
    /*
     * Removes read messages from dialog,
     * leaves only first one or unread in sequence
     *
     * @param {Backbone.Model} dialog subject for mutation
     */
    function removeReadMessages(dialog) {
        var messages = dialog.get('messages'),
            result = [messages.pop()],
            originalOut = result[0].out;

        messages.reverse().some(function (message) {
            if (message.out === originalOut && message.read_state === 0) {
                result.unshift(message);
            } else {
                // stop copying messages
                return true;
            }
        });
        dialog.set({'messages': result}, {silent: true});
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
                    unreadDialogs[index].set({
                        'messages': historyMessages.slice(1).reverse()
                    }, {silent: 'yes'});
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
    function getDialogs() {
        return Request.api({
            code: 'return API.messages.getDialogs({preview_length: 0});'
        }).then(function (response) {
            if (response && response[0]) {
                dialogColl.reset(response.slice(1).map(function (item) {
                    return {
                        id: item.chat_id ? 'chat_id_' + item.chat_id:'uid_' + item.uid,
                        chat_id: item.chat_id,
                        chat_active: item.chat_active,
                        uid: item.uid,
                        messages: [item]
                    };
                }));
            }
        });
    }

    readyDeferred.then(function () {
        Mediator.sub('longpoll:updates', onUpdates);

        // Notify about changes
        dialogColl.on('change', function () {
            var messages;

            dialogColl.sort();

            // Update latest message id,
            // required for notifications
            if (dialogColl.size()) {
                messages = dialogColl.first().get('messages');
                persistentModel.set(
                    'latestMessageId',
                    messages[messages.length - 1].mid
                );
            }

            publishData();
        });
        profilesColl.on('change', publishData);
    });

    Mediator.sub('auth:success', function (data) {
        initialize();

        userId = data.userId;
        getDialogs().then(getUnreadMessages).then(fetchProfiles).then(function () {
            readyDeferred.resolve();
        });
    });

    Mediator.sub('chat:data:get', function () {
        readyDeferred.then(publishData);
    });
});

angular.module('feedbacks', [
    'mediator',
    'request',
    'likes',
    'profiles-collection',
    'persistent-model',
    'notifications'
]).run(function (Request, Mediator, ProfilesCollection, Notifications, PersistentModel, $filter) {
    var
    MAX_ITEMS_COUNT = 50,
    UPDATE_PERIOD = 1000,

    readyDeferred = jQuery.Deferred(),
    rotateId, persistentModel, userId,
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
        if (ownerId !== userId || true) {
            profile = profilesColl.get(ownerId).toJSON(),
            name = $filter('name')(profile),
            gender = profile.sex === 1 ? 'female':'male';

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
                Notifications.create('news', {
                    title: title,
                    message: message,
                    image: profile.photo
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
            //everything except comments
            // filters: "'wall', 'mentions', 'likes', 'reposts', 'followers', 'friends'"
        },
        autoUpdateCommentsParams = {
            last_comments: 1,
            count: MAX_ITEMS_COUNT
        },
        itemsColl.reset();
        profilesColl.reset();
        clearTimeout(rotateId);
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
        itemModel.get('feedbacks').add(item.comments.list.map(function (feedback) {
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
            autoUpdateNotificationsParams.from = notifications.new_from;
            autoUpdateCommentsParams.start_time = response.time;
            autoUpdateCommentsParams.from = comments.new_from;

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
            rotateId = setTimeout(fetchFeedbacks, UPDATE_PERIOD);
        });
    }

    // entry point
    Mediator.sub('auth:success', function (data) {
        userId = data.userId;
        initialize();
    });

    readyDeferred.then(function () {
        publishData();

        itemsColl.on('add change', _.debounce(function () {
            var firstModel = itemsColl.first();

            itemsColl.sort();
            persistentModel.set(
                'latestFeedbackId',
                (firstModel.has('feedbacks') ? firstModel.get('feedbacks').last():firstModel).get('id')
            );
            publishData();
        }));
        profilesColl.on('change', publishData);

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
});

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


angular.module('mediator', [])
    .factory('Mediator', function () {
        var dispatcher = _.clone(Backbone.Events);

        chrome.extension.onMessage.addListener(function (messageData) {
            dispatcher.trigger.apply(dispatcher, messageData);
        });

        return {
            pub: function () {
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
                toJSON: function () {
                    // due to performance considerations,
                    // we track items by cid (uniq id) in view
                    var result = _.clone(this.attributes);
                    result.cid = this.cid;

                    return result;
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
            rotateId = setTimeout(fetchNewsfeed, UPDATE_PERIOD);
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

angular.module('notifications', ['mediator']).factory('Notifications', function (Mediator) {
    var QUEUE_TYPES = ['chat', 'news'],
        notificationQueue = new Backbone.Collection();

    function getBase64FromImage(url, onSuccess, onError) {
        var xhr = new XMLHttpRequest();

        xhr.responseType = "arraybuffer";
        xhr.open("GET", url);

        xhr.onload = function () {
            var base64, binary, bytes, mediaType;

            bytes = new Uint8Array(xhr.response);
            //NOTE String.fromCharCode.apply(String, ...
            //may cause "Maximum call stack size exceeded"
            binary = [].map.call(bytes, function (byte) {
                return String.fromCharCode(byte);
            }).join('');
            mediaType = xhr.getResponseHeader('content-type');
            base64 = [
                'data:',
                mediaType ? mediaType + ';':'',
                'base64,',
                btoa(binary)
            ].join('');
            onSuccess(base64);
        };
        xhr.onerror = onError;
        xhr.send();
    }

    chrome.browserAction.setBadgeBackgroundColor({
        color: [231, 76, 60, 255]
    });
    notificationQueue.on('add remove reset', function () {
        var count = notificationQueue.size();

        chrome.browserAction.setBadgeText({
            text: count ? String(count):''
        });
    });
    Mediator.sub('auth:success', function () {
        notificationQueue.reset();
    });
    // Remove seen updates
    Mediator.sub('router:change', function (params) {
        if (params.tab && notificationQueue.size()) {
            notificationQueue.remove(notificationQueue.where({
                type: params.tab
            }));
        }
    });
    Mediator.sub('notifications:queue:get', function () {
        Mediator.pub('notifications:queue', notificationQueue.toJSON());
    });
    return {
        /**
         * Show new notifications
         *
         * @param {Object} options
         * @param {String} options.title
         * @param {String} [options.photo]
         * @param {String} [options.message='']
         */
        create: function (type, options) {
            if (QUEUE_TYPES.indexOf(type) !== -1) {
                notificationQueue.push({type: type});
            }

            // TODO on error
            getBase64FromImage(options.image, function (base64) {
                chrome.notifications.create(_.uniqueId(), {
                    type: 'basic',
                    title: options.title,
                    message: options.message || '',
                    iconUrl: base64
                }, function () {});
            });
        }
    };
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
                    var self = this, queriesToProcess = apiQueriesQueue.splice(0, API_QUERIES_PER_REQUEST),
                        executeCodeTokens = [], executeCode,  i, method, params;

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
                            if (Array.isArray(response)) {
                                for (i = 0; i < response.length; i++) {
                                    queriesToProcess[i].deferred.resolve(response[i]);
                                }
                                self.processApiQueries();
                            } else {
                                console.warn(data);
                                // force relogin on API error
                                Auth.login(true);
                            }
                        }, function () {
                            // force relogin on API error
                            Auth.login(true);
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

angular.module('users', ['request', 'mediator']).factory('Users', function (Request, Mediator) {
    var
    DROP_PROFILES_INTERVAL = 500,
    USERS_GET_DEBOUNCE = 400,

    inProgress, usersGetQueue, friendsProfilesDefer,
    usersColl = new (Backbone.Collection.extend({
        model: Backbone.Model.extend({
            idAttribute: 'uid'
        })
    }))(),
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
            });
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

            queueItem.deferred.resolve(data);
        }
    };
    /**
     * Initialize all variables
     */
    function initialize() {
        inProgress = false;
        usersColl.reset();
        usersGetQueue = [],
        friendsProfilesDefer = null;
    }
    initialize();

    Mediator.sub('auth:success', function () {
        initialize();
    });

    dropOldNonFriendsProfiles();

    return {
        getFriendsProfiles: function () {
            if (!friendsProfilesDefer) {
                friendsProfilesDefer = Request.api({
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

            return friendsProfilesDefer;
        },
        /**
         * Returns profiles by ids
         * @param [Array<<Number>>] uids Array of user's uds
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
