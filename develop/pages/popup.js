;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('browser/browser.pu.js');
require('router/router.pu.js');

},{"browser/browser.pu.js":2,"router/router.pu.js":13}],2:[function(require,module,exports){
var _ = require('underscore')._,
    Mediator = require('mediator/mediator.js'),
    Browser = require('browser/detect.js');

if (Browser.firefox) {
    Mediator.sub('all', function () {
        extension.sendMessage([].slice.call(arguments));
    });
    extension.onMessage = function () {
        Mediator.pub.apply(Mediator, arguments);
    };
} else {
    throw "not implemented";
}

// Set up popup comminication
if (Browser.firefox) {
    module.exports = _.extend({}, {
        firefox: true
    }, Browser);
} else {
    throw "not implemented";
}

},{"browser/detect.js":3,"mediator/mediator.js":9,"underscore":21}],3:[function(require,module,exports){
module.exports = {
    chrome: true
    // firefox:  true
};

},{}],4:[function(require,module,exports){
var Browser = require('browser/detect.js');

exports.APP_ID = 3807372;
if (Browser.firefox) {
    exports.TRACKER_ID = 'UA-9568575-4';
} else if (Browser.chrome) {
    exports.TRACKER_ID = 'UA-9568575-2';
} else {
    exports.TRACKER_ID = 'UA-9568575-3';
}
exports.VK_PROTOCOL = 'https://';
exports.VK_BASE = exports.VK_PROTOCOL + 'vk.com/';
exports.AUTH_DOMAIN = exports.VK_PROTOCOL + 'oauth.vk.com/';
exports.AUTH_URI = [
    exports.AUTH_DOMAIN,
    'authorize?',
    [
        'client_id=' + exports.APP_ID,
        'scope=friends,photos,audio,video,docs,notes,pages,wall,groups,messages,notifications',
        'response_type=token',
        'redirect_uri=' + encodeURIComponent('https://oauth.vk.com/blank.html'),
        'display=page'
    ].join('&')
].join('');
console.log(exports.AUTH_URI);

},{"browser/detect.js":3}],5:[function(require,module,exports){
(function(){ module.exports || (module.exports = {}) 
var MessageFormat = { locale: {} };
MessageFormat.locale.en = function ( n ) {
  if ( n === 1 ) {
    return "one";
  }
  return "other";
};

module.exports["en"] = {}
module.exports["en"]["chat"] = function(d){
var r = "";
r += "chat";
return r;
}
module.exports["en"]["news"] = function(d){
var r = "";
r += "news";
return r;
}
module.exports["en"]["buddies"] = function(d){
var r = "";
r += "buddies";
return r;
}
module.exports["en"]["my"] = function(d){
var r = "";
r += "my";
return r;
}
module.exports["en"]["friends_nominative"] = function(d){
var r = "";
r += "friends";
return r;
}
module.exports["en"]["groups_nominative"] = function(d){
var r = "";
r += "groups";
return r;
}
module.exports["en"]["Private message"] = function(d){
var r = "";
r += "Private message";
return r;
}
module.exports["en"]["Wall post"] = function(d){
var r = "";
r += "Wall post";
return r;
}
module.exports["en"]["Search"] = function(d){
var r = "";
r += "First or last name";
return r;
}
module.exports["en"]["Male"] = function(d){
var r = "";
r += "Male";
return r;
}
module.exports["en"]["Female"] = function(d){
var r = "";
r += "Female";
return r;
}
module.exports["en"]["Offline"] = function(d){
var r = "";
r += "Offline";
return r;
}
module.exports["en"]["Bookmarked"] = function(d){
var r = "";
r += "Bookmarked";
return r;
}
module.exports["en"]["Monitor online status"] = function(d){
var r = "";
r += "Monitor online status";
return r;
}
module.exports["en"]["Mark as read"] = function(d){
var r = "";
r += "Mark as read";
return r;
}
module.exports["en"]["Your message wasn't read"] = function(d){
var r = "";
r += "Your message wasn't read";
return r;
}
module.exports["en"]["Like"] = function(d){
var r = "";
r += "Like";
return r;
}
module.exports["en"]["Show history"] = function(d){
var r = "";
r += "Show history";
return r;
}
module.exports["en"]["Open in New Tab"] = function(d){
var r = "";
r += "Open in New Tab";
return r;
}
module.exports["en"]["unsubscribe"] = function(d){
var r = "";
r += "unsubscribe";
return r;
}
module.exports["en"]["more..."] = function(d){
var r = "";
r += "more";
return r;
}
module.exports["en"]["Comment"] = function(d){
var r = "";
r += "Comment";
return r;
}
module.exports["en"]["Liked"] = function(d){
var r = "";
r += "Liked";
return r;
}
module.exports["en"]["Reposted"] = function(d){
var r = "";
r += "Reposted";
return r;
}
module.exports["en"]["New friends:"] = function(d){
var r = "";
r += "New friends:";
return r;
}
module.exports["en"]["started following you"] = function(d){
var r = "";
r += "started following you";
return r;
}
module.exports["en"]["friend request accepted"] = function(d){
var r = "";
r += "friend request accepted";
return r;
}
module.exports["en"]["sent a message"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
r += d["NAME"];
r += " sent a message";
return r;
}
module.exports["en"]["is online"] = function(d){
var r = "";
r += "is online";
return r;
}
module.exports["en"]["is_online_short"] = function(d){
var r = "";
r += "appeared";
return r;
}
module.exports["en"]["went offline"] = function(d){
var r = "";
r += "went offline";
return r;
}
module.exports["en"]["went_offline_short"] = function(d){
var r = "";
r += "went";
return r;
}
module.exports["en"]["left a comment"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
r += d["NAME"];
r += " left a comment";
return r;
}
module.exports["en"]["mentioned you"] = function(d){
var r = "";
r += "mentioned you";
return r;
}
module.exports["en"]["posted on your wall"] = function(d){
var r = "";
r += "posted on your wall";
return r;
}
module.exports["en"]["liked your comment"] = function(d){
var r = "";
r += "liked your comment";
return r;
}
module.exports["en"]["liked your post"] = function(d){
var r = "";
r += "liked your post";
return r;
}
module.exports["en"]["liked your photo"] = function(d){
var r = "";
r += "liked your photo";
return r;
}
module.exports["en"]["liked your video"] = function(d){
var r = "";
r += "liked your video";
return r;
}
module.exports["en"]["shared your post"] = function(d){
var r = "";
r += "shared your post";
return r;
}
module.exports["en"]["shared your photo"] = function(d){
var r = "";
r += "shared your photo";
return r;
}
module.exports["en"]["shared your video"] = function(d){
var r = "";
r += "shared your video";
return r;
}
module.exports["en"]["notifications"] = function(d){
var r = "";
r += "notifications";
return r;
}
module.exports["en"]["force online"] = function(d){
var r = "";
r += "Be always online";
return r;
}
module.exports["en"]["sound"] = function(d){
var r = "";
r += "sound";
return r;
}
module.exports["en"]["signal"] = function(d){
var r = "";
r += "signal";
return r;
}
module.exports["en"]["volume"] = function(d){
var r = "";
r += "volume";
return r;
}
module.exports["en"]["popups"] = function(d){
var r = "";
r += "popups";
return r;
}
module.exports["en"]["show text"] = function(d){
var r = "";
r += "show message text";
return r;
}
module.exports["en"]["show all"] = function(d){
var r = "";
r += "show all";
return r;
}
module.exports["en"]["hide"] = function(d){
var r = "";
r += "show less";
return r;
}
module.exports["en"]["Yandex search"] = function(d){
var r = "";
r += "Yandex search";
return r;
}
module.exports["en"]["install_noun"] = function(d){
var r = "";
r += "install";
return r;
}
module.exports["en"]["install_verb"] = function(d){
var r = "";
r += "install";
return r;
}
module.exports["en"]["skip"] = function(d){
var r = "";
r += "skip";
return r;
}
module.exports["en"]["login"] = function(d){
var r = "";
r += "login";
return r;
}
module.exports["en"]["accept"] = function(d){
var r = "";
r += "accept";
return r;
}
module.exports["en"]["no"] = function(d){
var r = "";
r += "no";
return r;
}
module.exports["en"]["close"] = function(d){
var r = "";
r += "close";
return r;
}
module.exports["en"]["Authorize VKfox with Vkontakte"] = function(d){
var r = "";
r += "First you need to authorize VKfox to connect with VK.COM™. If you are doing this for the first time you will be asked to grant access to your account.";
return r;
}
module.exports["en"]["Accept license agreement"] = function(d){
var r = "";
r += "By installing this application you agree to all terms, conditions, and information of the <a anchor='http://vkfox.org.ua/license'>license agreement.</a>";
return r;
}
module.exports["en"]["Install Yandex search"] = function(d){
var r = "";
r += "Please consider supporting future development of VKfox by installing Yandex search.";
return r;
}
module.exports["en"]["Thank you!"] = function(d){
var r = "";
r += "Thank you, installation is complete! Now this window can be closed.";
return r;
}
})();

},{}],6:[function(require,module,exports){
var DEFAULT_LANGUAGE = 'ru',

    _ = require('underscore')._,

    i18n = _.extend(
        {},
        require('./ru.js'),
        require('./uk.js'),
        require('./en.js')
    ), language, messages;

try {
    // language = navigator.language.split('-')[0].toLowerCase();
} catch (e) {}

if (!i18n[language]) {
    language = DEFAULT_LANGUAGE;
}

messages = i18n[language];

module.exports = {
    /**
     * Returns current browser language
     *
     * @returns {String}
     */
    getLang: function () {
        return language;
    },
    /**
     * Returns localized text
     *
     * @param [String] key
     * @param [...Mixed] any number of params
     *
     * @returns {String}
     */
    get: function (key) {
        return messages[key].apply(
            messages,
            [].slice.call(arguments, 1)
        );
    }
};

},{"./en.js":5,"./ru.js":7,"./uk.js":8,"underscore":21}],7:[function(require,module,exports){
(function(){ module.exports || (module.exports = {}) 
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

module.exports["ru"] = {}
module.exports["ru"]["chat"] = function(d){
var r = "";
r += "чат";
return r;
}
module.exports["ru"]["news"] = function(d){
var r = "";
r += "новости";
return r;
}
module.exports["ru"]["buddies"] = function(d){
var r = "";
r += "люди";
return r;
}
module.exports["ru"]["my"] = function(d){
var r = "";
r += "мои";
return r;
}
module.exports["ru"]["friends_nominative"] = function(d){
var r = "";
r += "друзей";
return r;
}
module.exports["ru"]["groups_nominative"] = function(d){
var r = "";
r += "групп";
return r;
}
module.exports["ru"]["Private message"] = function(d){
var r = "";
r += "Личное сообщение";
return r;
}
module.exports["ru"]["Wall post"] = function(d){
var r = "";
r += "Сообщение на стене";
return r;
}
module.exports["ru"]["Search"] = function(d){
var r = "";
r += "Имя или Фамилия";
return r;
}
module.exports["ru"]["Male"] = function(d){
var r = "";
r += "Мужчины";
return r;
}
module.exports["ru"]["Female"] = function(d){
var r = "";
r += "Женщины";
return r;
}
module.exports["ru"]["Offline"] = function(d){
var r = "";
r += "Не в сети";
return r;
}
module.exports["ru"]["Bookmarked"] = function(d){
var r = "";
r += "В закладках";
return r;
}
module.exports["ru"]["Monitor online status"] = function(d){
var r = "";
r += "Следить за онлайн статусом";
return r;
}
module.exports["ru"]["Mark as read"] = function(d){
var r = "";
r += "Отметить прочитанным";
return r;
}
module.exports["ru"]["Your message wasn't read"] = function(d){
var r = "";
r += "Ваше сообщение не прочитано";
return r;
}
module.exports["ru"]["Like"] = function(d){
var r = "";
r += "Нравится";
return r;
}
module.exports["ru"]["Show history"] = function(d){
var r = "";
r += "Показать историю";
return r;
}
module.exports["ru"]["Open in New Tab"] = function(d){
var r = "";
r += "Открыть в новом окне";
return r;
}
module.exports["ru"]["unsubscribe"] = function(d){
var r = "";
r += "отписаться";
return r;
}
module.exports["ru"]["more..."] = function(d){
var r = "";
r += "далee";
return r;
}
module.exports["ru"]["Comment"] = function(d){
var r = "";
r += "Комментировать";
return r;
}
module.exports["ru"]["Liked"] = function(d){
var r = "";
r += "Понравилось";
return r;
}
module.exports["ru"]["Reposted"] = function(d){
var r = "";
r += "Поделился записью";
return r;
}
module.exports["ru"]["New friends:"] = function(d){
var r = "";
r += "Новые друзья:";
return r;
}
module.exports["ru"]["started following you"] = function(d){
var r = "";
r += "хочет добавить в друзья";
return r;
}
module.exports["ru"]["friend request accepted"] = function(d){
var r = "";
r += "заявка в друзья подтверждена";
return r;
}
module.exports["ru"]["sent a message"] = function(d){
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
module.exports["ru"]["is online"] = function(d){
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
module.exports["ru"]["is_online_short"] = function(d){
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
return r;
}
module.exports["ru"]["went offline"] = function(d){
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
module.exports["ru"]["went_offline_short"] = function(d){
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
return r;
}
module.exports["ru"]["left a comment"] = function(d){
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
module.exports["ru"]["mentioned you"] = function(d){
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
module.exports["ru"]["posted on your wall"] = function(d){
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
module.exports["ru"]["liked your comment"] = function(d){
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
module.exports["ru"]["liked your post"] = function(d){
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
module.exports["ru"]["liked your photo"] = function(d){
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
module.exports["ru"]["liked your video"] = function(d){
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
module.exports["ru"]["shared your post"] = function(d){
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
module.exports["ru"]["shared your photo"] = function(d){
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
module.exports["ru"]["shared your video"] = function(d){
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
module.exports["ru"]["notifications"] = function(d){
var r = "";
r += "уведомления";
return r;
}
module.exports["ru"]["force online"] = function(d){
var r = "";
r += "быть всегда он-лайн";
return r;
}
module.exports["ru"]["sound"] = function(d){
var r = "";
r += "звук";
return r;
}
module.exports["ru"]["signal"] = function(d){
var r = "";
r += "сигнал";
return r;
}
module.exports["ru"]["volume"] = function(d){
var r = "";
r += "громкость";
return r;
}
module.exports["ru"]["popups"] = function(d){
var r = "";
r += "всплывающие окна";
return r;
}
module.exports["ru"]["show text"] = function(d){
var r = "";
r += "показывать текст";
return r;
}
module.exports["ru"]["show all"] = function(d){
var r = "";
r += "показать все";
return r;
}
module.exports["ru"]["hide"] = function(d){
var r = "";
r += "скрыть";
return r;
}
module.exports["ru"]["Yandex search"] = function(d){
var r = "";
r += "Яндекс поиск";
return r;
}
module.exports["ru"]["install_noun"] = function(d){
var r = "";
r += "установка";
return r;
}
module.exports["ru"]["install_verb"] = function(d){
var r = "";
r += "установить";
return r;
}
module.exports["ru"]["skip"] = function(d){
var r = "";
r += "пропустить";
return r;
}
module.exports["ru"]["login"] = function(d){
var r = "";
r += "авторизовать";
return r;
}
module.exports["ru"]["accept"] = function(d){
var r = "";
r += "принять";
return r;
}
module.exports["ru"]["no"] = function(d){
var r = "";
r += "нет";
return r;
}
module.exports["ru"]["close"] = function(d){
var r = "";
r += "закрыть";
return r;
}
module.exports["ru"]["Authorize VKfox with Vkontakte"] = function(d){
var r = "";
r += "Прежде всего, необходимо авторизироваться в VKfox. Если вы это делаете в первые вам будет необходимо разрешить доступ к вашей странице.";
return r;
}
module.exports["ru"]["Accept license agreement"] = function(d){
var r = "";
r += "Устанавливая данное приложение вы тем самым соглашаетесь со всеми правилами, условиями и информацией нашего <a anchor='http://vkfox.org.ua/license'>лицензионного соглашения.</a>";
return r;
}
module.exports["ru"]["Install Yandex search"] = function(d){
var r = "";
r += "Пожалуйста, поддержите дальнейшее развитие VKfox и установите новый Яндекс поиск.";
return r;
}
module.exports["ru"]["Thank you!"] = function(d){
var r = "";
r += "Спасибо, установка приложения окончена. Окно может быть закрыто.";
return r;
}
})();

},{}],8:[function(require,module,exports){
(function(){ module.exports || (module.exports = {}) 
var MessageFormat = { locale: {} };
MessageFormat.locale.uk = function (n) {
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

module.exports["uk"] = {}
module.exports["uk"]["chat"] = function(d){
var r = "";
r += "чат";
return r;
}
module.exports["uk"]["news"] = function(d){
var r = "";
r += "новини";
return r;
}
module.exports["uk"]["buddies"] = function(d){
var r = "";
r += "люди";
return r;
}
module.exports["uk"]["my"] = function(d){
var r = "";
r += "мої";
return r;
}
module.exports["uk"]["friends_nominative"] = function(d){
var r = "";
r += "друзів";
return r;
}
module.exports["uk"]["groups_nominative"] = function(d){
var r = "";
r += "груп";
return r;
}
module.exports["uk"]["Private message"] = function(d){
var r = "";
r += "Особисте повідомлення";
return r;
}
module.exports["uk"]["Wall post"] = function(d){
var r = "";
r += "Повідомлення на стіні";
return r;
}
module.exports["uk"]["Search"] = function(d){
var r = "";
r += "Ім'я або Прізвище";
return r;
}
module.exports["uk"]["Male"] = function(d){
var r = "";
r += "Чоловіки";
return r;
}
module.exports["uk"]["Female"] = function(d){
var r = "";
r += "Жінки";
return r;
}
module.exports["uk"]["Offline"] = function(d){
var r = "";
r += "Не в мережі";
return r;
}
module.exports["uk"]["Bookmarked"] = function(d){
var r = "";
r += "У закладках";
return r;
}
module.exports["uk"]["Monitor online status"] = function(d){
var r = "";
r += "Слідкувати за онлайн статусом";
return r;
}
module.exports["uk"]["Mark as read"] = function(d){
var r = "";
r += "Відзначити прочитаним";
return r;
}
module.exports["uk"]["Your message wasn't read"] = function(d){
var r = "";
r += "Ваше повідомлення не прочитано";
return r;
}
module.exports["uk"]["Like"] = function(d){
var r = "";
r += "Подобається";
return r;
}
module.exports["uk"]["Show history"] = function(d){
var r = "";
r += "Показати історію";
return r;
}
module.exports["uk"]["Open in New Tab"] = function(d){
var r = "";
r += "Відкрити у новому вікні";
return r;
}
module.exports["uk"]["unsubscribe"] = function(d){
var r = "";
r += "відписатися";
return r;
}
module.exports["uk"]["more..."] = function(d){
var r = "";
r += "далі";
return r;
}
module.exports["uk"]["Comment"] = function(d){
var r = "";
r += "Коментувати";
return r;
}
module.exports["uk"]["Liked"] = function(d){
var r = "";
r += "Сподобалось";
return r;
}
module.exports["uk"]["Reposted"] = function(d){
var r = "";
r += "Поділився записом";
return r;
}
module.exports["uk"]["New friends:"] = function(d){
var r = "";
r += "Нові друзі:";
return r;
}
module.exports["uk"]["started following you"] = function(d){
var r = "";
r += "хоче додати у друзі";
return r;
}
module.exports["uk"]["friend request accepted"] = function(d){
var r = "";
r += "заявка у друзі підтверджена";
return r;
}
module.exports["uk"]["sent a message"] = function(d){
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
r += "надіслав";
return r;
},
"female" : function(d){
var r = "";
r += "надіслала";
return r;
},
"other" : function(d){
var r = "";
r += "надіслав";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " повідомлення";
return r;
}
module.exports["uk"]["is online"] = function(d){
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
r += "з'явився";
return r;
},
"female" : function(d){
var r = "";
r += "з'явилася";
return r;
},
"other" : function(d){
var r = "";
r += "з'явився";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " в мережі";
return r;
}
module.exports["uk"]["is_online_short"] = function(d){
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
r += "з'явився";
return r;
},
"female" : function(d){
var r = "";
r += "з'явилася";
return r;
},
"other" : function(d){
var r = "";
r += "з'явився";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
return r;
}
module.exports["uk"]["went offline"] = function(d){
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
r += "вийшов";
return r;
},
"female" : function(d){
var r = "";
r += "вийшла";
return r;
},
"other" : function(d){
var r = "";
r += "вийшов";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " з мережі";
return r;
}
module.exports["uk"]["went_offline_short"] = function(d){
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
r += "вийшов";
return r;
},
"female" : function(d){
var r = "";
r += "вийшла";
return r;
},
"other" : function(d){
var r = "";
r += "вийшов";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
return r;
}
module.exports["uk"]["left a comment"] = function(d){
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
r += "залишив";
return r;
},
"female" : function(d){
var r = "";
r += "залишила";
return r;
},
"other" : function(d){
var r = "";
r += "залишив";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " коментар";
return r;
}
module.exports["uk"]["mentioned you"] = function(d){
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
r += "згадав";
return r;
},
"female" : function(d){
var r = "";
r += "згадала";
return r;
},
"other" : function(d){
var r = "";
r += "згадав";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вас";
return r;
}
module.exports["uk"]["posted on your wall"] = function(d){
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
r += "написав";
return r;
},
"female" : function(d){
var r = "";
r += "написала";
return r;
},
"other" : function(d){
var r = "";
r += "написав";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " на стіні";
return r;
}
module.exports["uk"]["liked your comment"] = function(d){
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
r += "оцінив";
return r;
},
"female" : function(d){
var r = "";
r += "оцінила";
return r;
},
"other" : function(d){
var r = "";
r += "оцінив";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " ваш коментар";
return r;
}
module.exports["uk"]["liked your post"] = function(d){
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
r += "оцінив";
return r;
},
"female" : function(d){
var r = "";
r += "оцінила";
return r;
},
"other" : function(d){
var r = "";
r += "оцінив";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вашу запис";
return r;
}
module.exports["uk"]["liked your photo"] = function(d){
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
r += "оцінив";
return r;
},
"female" : function(d){
var r = "";
r += "оцінила";
return r;
},
"other" : function(d){
var r = "";
r += "оцінив";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " ваше фото";
return r;
}
module.exports["uk"]["liked your video"] = function(d){
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
r += "оцінив";
return r;
},
"female" : function(d){
var r = "";
r += "оцінила";
return r;
},
"other" : function(d){
var r = "";
r += "оцінив";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " ваше відео";
return r;
}
module.exports["uk"]["shared your post"] = function(d){
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
r += "поділився";
return r;
},
"female" : function(d){
var r = "";
r += "поділилася";
return r;
},
"other" : function(d){
var r = "";
r += "поділився";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вашим записом";
return r;
}
module.exports["uk"]["shared your photo"] = function(d){
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
r += "поділився";
return r;
},
"female" : function(d){
var r = "";
r += "поділилася";
return r;
},
"other" : function(d){
var r = "";
r += "поділився";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вашим фото";
return r;
}
module.exports["uk"]["shared your video"] = function(d){
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
r += "поділився";
return r;
},
"female" : function(d){
var r = "";
r += "поділилася";
return r;
},
"other" : function(d){
var r = "";
r += "поділився";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вашим відео";
return r;
}
module.exports["uk"]["notifications"] = function(d){
var r = "";
r += "повідомлення";
return r;
}
module.exports["uk"]["force online"] = function(d){
var r = "";
r += "бути завжди он-лайн";
return r;
}
module.exports["uk"]["sound"] = function(d){
var r = "";
r += "звук";
return r;
}
module.exports["uk"]["signal"] = function(d){
var r = "";
r += "сигнал";
return r;
}
module.exports["uk"]["volume"] = function(d){
var r = "";
r += "гучність";
return r;
}
module.exports["uk"]["popups"] = function(d){
var r = "";
r += "спливаючі вікна";
return r;
}
module.exports["uk"]["show all"] = function(d){
var r = "";
r += "показати усе";
return r;
}
module.exports["uk"]["hide"] = function(d){
var r = "";
r += "приховати";
return r;
}
module.exports["uk"]["show text"] = function(d){
var r = "";
r += "показувати текст";
return r;
}
module.exports["uk"]["Yandex search"] = function(d){
var r = "";
r += "Яндекс пошук";
return r;
}
module.exports["uk"]["install_noun"] = function(d){
var r = "";
r += "установка";
return r;
}
module.exports["uk"]["install_verb"] = function(d){
var r = "";
r += "встановити";
return r;
}
module.exports["uk"]["skip"] = function(d){
var r = "";
r += "пропустити";
return r;
}
module.exports["uk"]["login"] = function(d){
var r = "";
r += "авторизувати";
return r;
}
module.exports["uk"]["accept"] = function(d){
var r = "";
r += "прийняти";
return r;
}
module.exports["uk"]["no"] = function(d){
var r = "";
r += "ні";
return r;
}
module.exports["uk"]["close"] = function(d){
var r = "";
r += "закрити";
return r;
}
module.exports["uk"]["Authorize VKfox with Vkontakte"] = function(d){
var r = "";
r += "Перш за все, необхідно авторизуватися у VKfox. Якщо ви це робите у перше, вам буде необхідно дозволити доступ до вашої сторінки.";
return r;
}
module.exports["uk"]["Accept license agreement"] = function(d){
var r = "";
r += "Встановлюючи даний додаток ви погоджуєтесь з усіма правилами, умовами та інформацією нашої <a anchor='http: //vkfox.org.ua/license'>ліцензійної угоди.</a>";
return r;
}
module.exports["uk"]["Install Yandex search"] = function(d){
var r = "";
r += "Будь ласка, підтримайте подальший розвиток VKfox та встановіть новий Яндекс пошук.";
return r;
}
module.exports["uk"]["Thank you!"] = function(d){
var r = "";
r += "Дякуємо, установка додатку закінчена. Вікно може бути закрито.";
return r;
}
})();

},{}],9:[function(require,module,exports){
var _ = require('underscore')._,
    Backbone = require('backbone'),
    dispatcher = _.clone(Backbone.Events);

module.exports = {
    pub: function () {
        dispatcher.trigger.apply(dispatcher, arguments);
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

},{"backbone":18,"underscore":21}],10:[function(require,module,exports){
var Backbone = require('backbone'),
    storage = require('storage/storage.js');

module.exports = Backbone.Model.extend({
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
        item = storage.getItem(this._name);

        if (item) {
            this.set(JSON.parse(item), {
                silent: true
            });
        }

        this.on('change', this._save.bind(this));
    },
    _save: function () {
        storage.setItem(this._name, JSON.stringify(this.toJSON()));
    }
});


},{"backbone":18,"storage/storage.js":14}],11:[function(require,module,exports){
/*jshint bitwise: false*/
/**
 * Returns a correct implementation
 * for background or popup page
 */
if (location && ~location.href.indexOf('popup')) {
    return require('./request.pu.js');
} else {
    return require('./request.bg.js');
}

},{"./request.bg.js":19,"./request.pu.js":12}],12:[function(require,module,exports){
var Vow = require('vow'),
    _ = require('underscore')._,
    Mediator = require('mediator/mediator.js');

module.exports = {
    api: function () {
        var ajaxPromise = new Vow.promise(),
            id = _.uniqueId();

        Mediator.pub('request', {
            method: 'api',
            id: id,
            'arguments': [].slice.apply(arguments)
        });
        Mediator.once('request:' + id, function (data) {
            ajaxPromise[data.method].apply(ajaxPromise, data['arguments']);
        });

        return ajaxPromise;

    }
};

},{"mediator/mediator.js":9,"underscore":21,"vow":22}],13:[function(require,module,exports){
var Vow = require('vow'),
    Mediator = require('mediator/mediator.js'),
    Tracker = require('tracker/tracker.js');

require('angular')
    .module('router', [])
    .config(function ($routeProvider, $locationProvider, $compileProvider) {
        $locationProvider.html5Mode(true);

        $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);

        $routeProvider
        .when('/news', {
            redirectTo: '/news/my'
        })
        .when('/:tab', {
            templateUrl: function (params) {
                return [
                    '/modules/', params.tab,
                    '/', params.tab, '.tmpl.html'
                ].join('');
            }
        })
        .when('/:tab/:subtab', {
            templateUrl: function (params) {
                return [
                    '/modules/', params.tab,
                    '/', params.tab, '.tmpl.html'
                ].join('');
            }
        });
    })
    .run(function ($location, $rootScope) {
        // default tab is chat
        var notificationsPromise = Vow.promise(),
            authPromise = Vow.promise(),
            lastPathDeferred = Vow.promise(),
            READY = 2; //ready status from auth module

        $rootScope.$on('$routeChangeSuccess', function (scope, current) {
            Mediator.pub('router:change', current.params);
            if (current.params.tab) {
                Tracker.trackPage();
                Mediator.pub('router:lastPath:put', $location.path());
            }
        });
        Mediator.sub('notifications:queue', function (queue) {
            notificationsPromise.resolve(queue);
        });
        Mediator.sub('auth:state', function (state) {
            authPromise.resolve(state);
        });
        Mediator.sub('router:lastPath', function (lastPath) {
            lastPathDeferred.resolve(lastPath);
        });
        Vow.all([notificationsPromise, authPromise]).spread(function (queue, state) {
            $rootScope.$apply(function () {
                if (state === READY) {
                    if (queue.length) {
                        // queue contains updates from tabs.
                        // Property 'type' holds value
                        $location.path('/' + queue[queue.length - 1].type);
                        $location.replace();
                    } else {
                        lastPathDeferred.then(function (lastPath) {
                            $rootScope.$apply(function () {
                                $location.path(lastPath);
                                $location.replace();
                            });
                        });
                    }
                }
            });
        });
        authPromise.then(function (state) {
            if (state !== READY) {
                Mediator.pub('auth:oauth');
                window.close();
            }
        });
        Mediator.pub('auth:state:get');
        Mediator.pub('notifications:queue:get');
        Mediator.pub('router:lastPath:get');
    });

},{"angular":16,"mediator/mediator.js":9,"tracker/tracker.js":15,"vow":22}],14:[function(require,module,exports){
var Browser = require('browser/detect.js');

if (Browser.firefox) {
    var storage = require("sdk/simple-storage");

    module.exports = {
        getItem: function (key) {
            return storage[key];
        },
        setItem: function (key, value) {
            storage[key] = value;
        }
    };
} else {
    module.exports = localStorage;
}



},{"browser/detect.js":3,"sdk/simple-storage":19}],15:[function(require,module,exports){
/*jshint bitwise: false */
var
_ = require('underscore')._,
PersistentModel = require('persistent-model/persistent-model.js'),
I18n = require('i18n/i18n.js'),
Request = require('request/request.js'),
Config = require('config/config.js'),

url = 'http://www.google-analytics.com/collect',
persistentModel = new PersistentModel({}, {name: 'tracker'}),
requiredParams;

/**
* Creates unique identifier if VKfox instance
*
* @see http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
*/
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

if (!persistentModel.has('guid')) {
    persistentModel.set('guid', guid());
}

requiredParams = {
    v: 1,               // Version.
    tid: Config.TRACKER_ID,    // Tracking ID / Web property / Property ID.
    cid: persistentModel.get('guid'), // Anonymous Client ID.
    ul: I18n.getLang(), //user language
    // TODO
    // ap: chrome.app.getDetails().version //app version
};

module.exports = {
    trackPage: function () {
        Request.post(url, _.extend({}, requiredParams, {
            t: 'pageview',          // Pageview hit type.
            dh: location.hostname,  // Document hostname.
            dp: location.pathname  // Page
        }));
    },
    /**
    * Tracks a custom event
    * @param {String} category
    * @param {String} action
    * @param {String} [label]
    * @param {Number} [value]
    */
    trackEvent: function (category, action, label, value) {
        Request.post(url, _.extend({}, requiredParams, {
            t: 'event', // Event hit type
            ec: category, // Event Category. Required.
            ea: action, // Event Action. Required.
            el: label, // Event label.
            ev: value, // Event value.
            dh: location.hostname,  // Document hostname.
            dp: location.pathname  // Page
        }));
    }
};

},{"config/config.js":4,"i18n/i18n.js":6,"persistent-model/persistent-model.js":10,"request/request.js":11,"underscore":21}],16:[function(require,module,exports){
require('./lib/angular.min.js');

module.exports = angular;

},{"./lib/angular.min.js":17}],17:[function(require,module,exports){
/*
 AngularJS v1.1.5
 (c) 2010-2012 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(M,T,p){'use strict';function lc(){var b=M.angular;M.angular=mc;return b}function Xa(b){return!b||typeof b.length!=="number"?!1:typeof b.hasOwnProperty!="function"&&typeof b.constructor!="function"?!0:b instanceof R||ga&&b instanceof ga||Ea.call(b)!=="[object Object]"||typeof b.callee==="function"}function n(b,a,c){var d;if(b)if(H(b))for(d in b)d!="prototype"&&d!="length"&&d!="name"&&b.hasOwnProperty(d)&&a.call(c,b[d],d);else if(b.forEach&&b.forEach!==n)b.forEach(a,c);else if(Xa(b))for(d=
0;d<b.length;d++)a.call(c,b[d],d);else for(d in b)b.hasOwnProperty(d)&&a.call(c,b[d],d);return b}function qb(b){var a=[],c;for(c in b)b.hasOwnProperty(c)&&a.push(c);return a.sort()}function nc(b,a,c){for(var d=qb(b),e=0;e<d.length;e++)a.call(c,b[d[e]],d[e]);return d}function rb(b){return function(a,c){b(c,a)}}function Fa(){for(var b=ba.length,a;b;){b--;a=ba[b].charCodeAt(0);if(a==57)return ba[b]="A",ba.join("");if(a==90)ba[b]="0";else return ba[b]=String.fromCharCode(a+1),ba.join("")}ba.unshift("0");
return ba.join("")}function sb(b,a){a?b.$$hashKey=a:delete b.$$hashKey}function t(b){var a=b.$$hashKey;n(arguments,function(a){a!==b&&n(a,function(a,c){b[c]=a})});sb(b,a);return b}function N(b){return parseInt(b,10)}function tb(b,a){return t(new (t(function(){},{prototype:b})),a)}function q(){}function qa(b){return b}function S(b){return function(){return b}}function C(b){return typeof b=="undefined"}function B(b){return typeof b!="undefined"}function L(b){return b!=null&&typeof b=="object"}function E(b){return typeof b==
"string"}function Ya(b){return typeof b=="number"}function ra(b){return Ea.apply(b)=="[object Date]"}function F(b){return Ea.apply(b)=="[object Array]"}function H(b){return typeof b=="function"}function sa(b){return b&&b.document&&b.location&&b.alert&&b.setInterval}function U(b){return E(b)?b.replace(/^\s*/,"").replace(/\s*$/,""):b}function oc(b){return b&&(b.nodeName||b.bind&&b.find)}function Za(b,a,c){var d=[];n(b,function(b,g,i){d.push(a.call(c,b,g,i))});return d}function Ga(b,a){if(b.indexOf)return b.indexOf(a);
for(var c=0;c<b.length;c++)if(a===b[c])return c;return-1}function ta(b,a){var c=Ga(b,a);c>=0&&b.splice(c,1);return a}function V(b,a){if(sa(b)||b&&b.$evalAsync&&b.$watch)throw Error("Can't copy Window or Scope");if(a){if(b===a)throw Error("Can't copy equivalent objects or arrays");if(F(b))for(var c=a.length=0;c<b.length;c++)a.push(V(b[c]));else{c=a.$$hashKey;n(a,function(b,c){delete a[c]});for(var d in b)a[d]=V(b[d]);sb(a,c)}}else(a=b)&&(F(b)?a=V(b,[]):ra(b)?a=new Date(b.getTime()):L(b)&&(a=V(b,{})));
return a}function pc(b,a){var a=a||{},c;for(c in b)b.hasOwnProperty(c)&&c.substr(0,2)!=="$$"&&(a[c]=b[c]);return a}function ia(b,a){if(b===a)return!0;if(b===null||a===null)return!1;if(b!==b&&a!==a)return!0;var c=typeof b,d;if(c==typeof a&&c=="object")if(F(b)){if((c=b.length)==a.length){for(d=0;d<c;d++)if(!ia(b[d],a[d]))return!1;return!0}}else if(ra(b))return ra(a)&&b.getTime()==a.getTime();else{if(b&&b.$evalAsync&&b.$watch||a&&a.$evalAsync&&a.$watch||sa(b)||sa(a))return!1;c={};for(d in b)if(!(d.charAt(0)===
"$"||H(b[d]))){if(!ia(b[d],a[d]))return!1;c[d]=!0}for(d in a)if(!c[d]&&d.charAt(0)!=="$"&&a[d]!==p&&!H(a[d]))return!1;return!0}return!1}function $a(b,a){var c=arguments.length>2?ka.call(arguments,2):[];return H(a)&&!(a instanceof RegExp)?c.length?function(){return arguments.length?a.apply(b,c.concat(ka.call(arguments,0))):a.apply(b,c)}:function(){return arguments.length?a.apply(b,arguments):a.call(b)}:a}function qc(b,a){var c=a;/^\$+/.test(b)?c=p:sa(a)?c="$WINDOW":a&&T===a?c="$DOCUMENT":a&&a.$evalAsync&&
a.$watch&&(c="$SCOPE");return c}function ha(b,a){return JSON.stringify(b,qc,a?"  ":null)}function ub(b){return E(b)?JSON.parse(b):b}function ua(b){b&&b.length!==0?(b=I(""+b),b=!(b=="f"||b=="0"||b=="false"||b=="no"||b=="n"||b=="[]")):b=!1;return b}function va(b){b=w(b).clone();try{b.html("")}catch(a){}var c=w("<div>").append(b).html();try{return b[0].nodeType===3?I(c):c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/,function(a,b){return"<"+I(b)})}catch(d){return I(c)}}function vb(b){var a={},c,d;n((b||
"").split("&"),function(b){b&&(c=b.split("="),d=decodeURIComponent(c[0]),a[d]=B(c[1])?decodeURIComponent(c[1]):!0)});return a}function wb(b){var a=[];n(b,function(b,d){a.push(wa(d,!0)+(b===!0?"":"="+wa(b,!0)))});return a.length?a.join("&"):""}function ab(b){return wa(b,!0).replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+")}function wa(b,a){return encodeURIComponent(b).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,a?"%20":"+")}function rc(b,
a){function c(a){a&&d.push(a)}var d=[b],e,g,i=["ng:app","ng-app","x-ng-app","data-ng-app"],f=/\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;n(i,function(a){i[a]=!0;c(T.getElementById(a));a=a.replace(":","\\:");b.querySelectorAll&&(n(b.querySelectorAll("."+a),c),n(b.querySelectorAll("."+a+"\\:"),c),n(b.querySelectorAll("["+a+"]"),c))});n(d,function(a){if(!e){var b=f.exec(" "+a.className+" ");b?(e=a,g=(b[2]||"").replace(/\s+/g,",")):n(a.attributes,function(b){if(!e&&i[b.name])e=a,g=b.value})}});e&&a(e,g?[g]:[])}
function xb(b,a){var c=function(){b=w(b);a=a||[];a.unshift(["$provide",function(a){a.value("$rootElement",b)}]);a.unshift("ng");var c=yb(a);c.invoke(["$rootScope","$rootElement","$compile","$injector","$animator",function(a,b,c,d,e){a.$apply(function(){b.data("$injector",d);c(b)(a)});e.enabled(!0)}]);return c},d=/^NG_DEFER_BOOTSTRAP!/;if(M&&!d.test(M.name))return c();M.name=M.name.replace(d,"");Ha.resumeBootstrap=function(b){n(b,function(b){a.push(b)});c()}}function bb(b,a){a=a||"_";return b.replace(sc,
function(b,d){return(d?a:"")+b.toLowerCase()})}function cb(b,a,c){if(!b)throw Error("Argument '"+(a||"?")+"' is "+(c||"required"));return b}function xa(b,a,c){c&&F(b)&&(b=b[b.length-1]);cb(H(b),a,"not a function, got "+(b&&typeof b=="object"?b.constructor.name||"Object":typeof b));return b}function tc(b){function a(a,b,e){return a[b]||(a[b]=e())}return a(a(b,"angular",Object),"module",function(){var b={};return function(d,e,g){e&&b.hasOwnProperty(d)&&(b[d]=null);return a(b,d,function(){function a(c,
d,e){return function(){b[e||"push"]([c,d,arguments]);return m}}if(!e)throw Error("No module: "+d);var b=[],c=[],j=a("$injector","invoke"),m={_invokeQueue:b,_runBlocks:c,requires:e,name:d,provider:a("$provide","provider"),factory:a("$provide","factory"),service:a("$provide","service"),value:a("$provide","value"),constant:a("$provide","constant","unshift"),animation:a("$animationProvider","register"),filter:a("$filterProvider","register"),controller:a("$controllerProvider","register"),directive:a("$compileProvider",
"directive"),config:j,run:function(a){c.push(a);return this}};g&&j(g);return m})}})}function Ia(b){return b.replace(uc,function(a,b,d,e){return e?d.toUpperCase():d}).replace(vc,"Moz$1")}function db(b,a){function c(){var e;for(var b=[this],c=a,i,f,h,j,m,k;b.length;){i=b.shift();f=0;for(h=i.length;f<h;f++){j=w(i[f]);c?j.triggerHandler("$destroy"):c=!c;m=0;for(e=(k=j.children()).length,j=e;m<j;m++)b.push(ga(k[m]))}}return d.apply(this,arguments)}var d=ga.fn[b],d=d.$original||d;c.$original=d;ga.fn[b]=
c}function R(b){if(b instanceof R)return b;if(!(this instanceof R)){if(E(b)&&b.charAt(0)!="<")throw Error("selectors not implemented");return new R(b)}if(E(b)){var a=T.createElement("div");a.innerHTML="<div>&#160;</div>"+b;a.removeChild(a.firstChild);eb(this,a.childNodes);this.remove()}else eb(this,b)}function fb(b){return b.cloneNode(!0)}function ya(b){zb(b);for(var a=0,b=b.childNodes||[];a<b.length;a++)ya(b[a])}function Ab(b,a,c){var d=ca(b,"events");ca(b,"handle")&&(C(a)?n(d,function(a,c){gb(b,
c,a);delete d[c]}):C(c)?(gb(b,a,d[a]),delete d[a]):ta(d[a],c))}function zb(b){var a=b[Ja],c=Ka[a];c&&(c.handle&&(c.events.$destroy&&c.handle({},"$destroy"),Ab(b)),delete Ka[a],b[Ja]=p)}function ca(b,a,c){var d=b[Ja],d=Ka[d||-1];if(B(c))d||(b[Ja]=d=++wc,d=Ka[d]={}),d[a]=c;else return d&&d[a]}function Bb(b,a,c){var d=ca(b,"data"),e=B(c),g=!e&&B(a),i=g&&!L(a);!d&&!i&&ca(b,"data",d={});if(e)d[a]=c;else if(g)if(i)return d&&d[a];else t(d,a);else return d}function La(b,a){return(" "+b.className+" ").replace(/[\n\t]/g,
" ").indexOf(" "+a+" ")>-1}function Cb(b,a){a&&n(a.split(" "),function(a){b.className=U((" "+b.className+" ").replace(/[\n\t]/g," ").replace(" "+U(a)+" "," "))})}function Db(b,a){a&&n(a.split(" "),function(a){if(!La(b,a))b.className=U(b.className+" "+U(a))})}function eb(b,a){if(a)for(var a=!a.nodeName&&B(a.length)&&!sa(a)?a:[a],c=0;c<a.length;c++)b.push(a[c])}function Eb(b,a){return Ma(b,"$"+(a||"ngController")+"Controller")}function Ma(b,a,c){b=w(b);for(b[0].nodeType==9&&(b=b.find("html"));b.length;){if(c=
b.data(a))return c;b=b.parent()}}function Fb(b,a){var c=Na[a.toLowerCase()];return c&&Gb[b.nodeName]&&c}function xc(b,a){var c=function(c,e){if(!c.preventDefault)c.preventDefault=function(){c.returnValue=!1};if(!c.stopPropagation)c.stopPropagation=function(){c.cancelBubble=!0};if(!c.target)c.target=c.srcElement||T;if(C(c.defaultPrevented)){var g=c.preventDefault;c.preventDefault=function(){c.defaultPrevented=!0;g.call(c)};c.defaultPrevented=!1}c.isDefaultPrevented=function(){return c.defaultPrevented||
c.returnValue==!1};n(a[e||c.type],function(a){a.call(b,c)});Z<=8?(c.preventDefault=null,c.stopPropagation=null,c.isDefaultPrevented=null):(delete c.preventDefault,delete c.stopPropagation,delete c.isDefaultPrevented)};c.elem=b;return c}function la(b){var a=typeof b,c;if(a=="object"&&b!==null)if(typeof(c=b.$$hashKey)=="function")c=b.$$hashKey();else{if(c===p)c=b.$$hashKey=Fa()}else c=b;return a+":"+c}function za(b){n(b,this.put,this)}function Hb(b){var a,c;if(typeof b=="function"){if(!(a=b.$inject))a=
[],c=b.toString().replace(yc,""),c=c.match(zc),n(c[1].split(Ac),function(b){b.replace(Bc,function(b,c,d){a.push(d)})}),b.$inject=a}else F(b)?(c=b.length-1,xa(b[c],"fn"),a=b.slice(0,c)):xa(b,"fn",!0);return a}function yb(b){function a(a){return function(b,c){if(L(b))n(b,rb(a));else return a(b,c)}}function c(a,b){if(H(b)||F(b))b=k.instantiate(b);if(!b.$get)throw Error("Provider "+a+" must define $get factory method.");return m[a+f]=b}function d(a,b){return c(a,{$get:b})}function e(a){var b=[];n(a,function(a){if(!j.get(a))if(j.put(a,
!0),E(a)){var c=Aa(a);b=b.concat(e(c.requires)).concat(c._runBlocks);try{for(var d=c._invokeQueue,c=0,f=d.length;c<f;c++){var g=d[c],o=k.get(g[0]);o[g[1]].apply(o,g[2])}}catch(h){throw h.message&&(h.message+=" from "+a),h;}}else if(H(a))try{b.push(k.invoke(a))}catch(l){throw l.message&&(l.message+=" from "+a),l;}else if(F(a))try{b.push(k.invoke(a))}catch(i){throw i.message&&(i.message+=" from "+String(a[a.length-1])),i;}else xa(a,"module")});return b}function g(a,b){function c(d){if(typeof d!=="string")throw Error("Service name expected");
if(a.hasOwnProperty(d)){if(a[d]===i)throw Error("Circular dependency: "+h.join(" <- "));return a[d]}else try{return h.unshift(d),a[d]=i,a[d]=b(d)}finally{h.shift()}}function d(a,b,e){var f=[],j=Hb(a),g,o,h;o=0;for(g=j.length;o<g;o++)h=j[o],f.push(e&&e.hasOwnProperty(h)?e[h]:c(h));a.$inject||(a=a[g]);switch(b?-1:f.length){case 0:return a();case 1:return a(f[0]);case 2:return a(f[0],f[1]);case 3:return a(f[0],f[1],f[2]);case 4:return a(f[0],f[1],f[2],f[3]);case 5:return a(f[0],f[1],f[2],f[3],f[4]);
case 6:return a(f[0],f[1],f[2],f[3],f[4],f[5]);case 7:return a(f[0],f[1],f[2],f[3],f[4],f[5],f[6]);case 8:return a(f[0],f[1],f[2],f[3],f[4],f[5],f[6],f[7]);case 9:return a(f[0],f[1],f[2],f[3],f[4],f[5],f[6],f[7],f[8]);case 10:return a(f[0],f[1],f[2],f[3],f[4],f[5],f[6],f[7],f[8],f[9]);default:return a.apply(b,f)}}return{invoke:d,instantiate:function(a,b){var c=function(){},e;c.prototype=(F(a)?a[a.length-1]:a).prototype;c=new c;e=d(a,c,b);return L(e)?e:c},get:c,annotate:Hb,has:function(b){return m.hasOwnProperty(b+
f)||a.hasOwnProperty(b)}}}var i={},f="Provider",h=[],j=new za,m={$provide:{provider:a(c),factory:a(d),service:a(function(a,b){return d(a,["$injector",function(a){return a.instantiate(b)}])}),value:a(function(a,b){return d(a,S(b))}),constant:a(function(a,b){m[a]=b;l[a]=b}),decorator:function(a,b){var c=k.get(a+f),d=c.$get;c.$get=function(){var a=u.invoke(d,c);return u.invoke(b,null,{$delegate:a})}}}},k=m.$injector=g(m,function(){throw Error("Unknown provider: "+h.join(" <- "));}),l={},u=l.$injector=
g(l,function(a){a=k.get(a+f);return u.invoke(a.$get,a)});n(e(b),function(a){u.invoke(a||q)});return u}function Cc(){var b=!0;this.disableAutoScrolling=function(){b=!1};this.$get=["$window","$location","$rootScope",function(a,c,d){function e(a){var b=null;n(a,function(a){!b&&I(a.nodeName)==="a"&&(b=a)});return b}function g(){var b=c.hash(),d;b?(d=i.getElementById(b))?d.scrollIntoView():(d=e(i.getElementsByName(b)))?d.scrollIntoView():b==="top"&&a.scrollTo(0,0):a.scrollTo(0,0)}var i=a.document;b&&d.$watch(function(){return c.hash()},
function(){d.$evalAsync(g)});return g}]}function Ib(b){this.register=function(a,c){b.factory(Ia(a)+"Animation",c)};this.$get=["$injector",function(a){return function(b){if(b&&(b=Ia(b)+"Animation",a.has(b)))return a.get(b)}}]}function Dc(b,a,c,d){function e(a){try{a.apply(null,ka.call(arguments,1))}finally{if(o--,o===0)for(;z.length;)try{z.pop()()}catch(b){c.error(b)}}}function g(a,b){(function s(){n(r,function(a){a()});y=b(s,a)})()}function i(){x!=f.url()&&(x=f.url(),n(v,function(a){a(f.url())}))}
var f=this,h=a[0],j=b.location,m=b.history,k=b.setTimeout,l=b.clearTimeout,u={};f.isMock=!1;var o=0,z=[];f.$$completeOutstandingRequest=e;f.$$incOutstandingRequestCount=function(){o++};f.notifyWhenNoOutstandingRequests=function(a){n(r,function(a){a()});o===0?a():z.push(a)};var r=[],y;f.addPollFn=function(a){C(y)&&g(100,k);r.push(a);return a};var x=j.href,W=a.find("base");f.url=function(a,b){if(a){if(x!=a)return x=a,d.history?b?m.replaceState(null,"",a):(m.pushState(null,"",a),W.attr("href",W.attr("href"))):
b?j.replace(a):j.href=a,f}else return j.href.replace(/%27/g,"'")};var v=[],A=!1;f.onUrlChange=function(a){A||(d.history&&w(b).bind("popstate",i),d.hashchange?w(b).bind("hashchange",i):f.addPollFn(i),A=!0);v.push(a);return a};f.baseHref=function(){var a=W.attr("href");return a?a.replace(/^https?\:\/\/[^\/]*/,""):""};var G={},D="",$=f.baseHref();f.cookies=function(a,b){var d,e,f,j;if(a)if(b===p)h.cookie=escape(a)+"=;path="+$+";expires=Thu, 01 Jan 1970 00:00:00 GMT";else{if(E(b))d=(h.cookie=escape(a)+
"="+escape(b)+";path="+$).length+1,d>4096&&c.warn("Cookie '"+a+"' possibly not set or overflowed because it was too large ("+d+" > 4096 bytes)!")}else{if(h.cookie!==D){D=h.cookie;d=D.split("; ");G={};for(f=0;f<d.length;f++)e=d[f],j=e.indexOf("="),j>0&&(a=unescape(e.substring(0,j)),G[a]===p&&(G[a]=unescape(e.substring(j+1))))}return G}};f.defer=function(a,b){var c;o++;c=k(function(){delete u[c];e(a)},b||0);u[c]=!0;return c};f.defer.cancel=function(a){return u[a]?(delete u[a],l(a),e(q),!0):!1}}function Ec(){this.$get=
["$window","$log","$sniffer","$document",function(b,a,c,d){return new Dc(b,d,a,c)}]}function Fc(){this.$get=function(){function b(b,d){function e(a){if(a!=k){if(l){if(l==a)l=a.n}else l=a;g(a.n,a.p);g(a,k);k=a;k.n=null}}function g(a,b){if(a!=b){if(a)a.p=b;if(b)b.n=a}}if(b in a)throw Error("cacheId "+b+" taken");var i=0,f=t({},d,{id:b}),h={},j=d&&d.capacity||Number.MAX_VALUE,m={},k=null,l=null;return a[b]={put:function(a,b){var c=m[a]||(m[a]={key:a});e(c);if(!C(b))return a in h||i++,h[a]=b,i>j&&this.remove(l.key),
b},get:function(a){var b=m[a];if(b)return e(b),h[a]},remove:function(a){var b=m[a];if(b){if(b==k)k=b.p;if(b==l)l=b.n;g(b.n,b.p);delete m[a];delete h[a];i--}},removeAll:function(){h={};i=0;m={};k=l=null},destroy:function(){m=f=h=null;delete a[b]},info:function(){return t({},f,{size:i})}}}var a={};b.info=function(){var b={};n(a,function(a,e){b[e]=a.info()});return b};b.get=function(b){return a[b]};return b}}function Gc(){this.$get=["$cacheFactory",function(b){return b("templates")}]}function Jb(b){var a=
{},c="Directive",d=/^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/,e=/(([\d\w\-_]+)(?:\:([^;]+))?;?)/,g="Template must have exactly one root element. was: ",i=/^\s*(https?|ftp|mailto|file):/;this.directive=function h(d,e){E(d)?(cb(e,"directive"),a.hasOwnProperty(d)||(a[d]=[],b.factory(d+c,["$injector","$exceptionHandler",function(b,c){var e=[];n(a[d],function(a){try{var g=b.invoke(a);if(H(g))g={compile:S(g)};else if(!g.compile&&g.link)g.compile=S(g.link);g.priority=g.priority||0;g.name=g.name||d;g.require=
g.require||g.controller&&g.name;g.restrict=g.restrict||"A";e.push(g)}catch(h){c(h)}});return e}])),a[d].push(e)):n(d,rb(h));return this};this.urlSanitizationWhitelist=function(a){return B(a)?(i=a,this):i};this.$get=["$injector","$interpolate","$exceptionHandler","$http","$templateCache","$parse","$controller","$rootScope","$document",function(b,j,m,k,l,u,o,z,r){function y(a,b,c){a instanceof w||(a=w(a));n(a,function(b,c){b.nodeType==3&&b.nodeValue.match(/\S+/)&&(a[c]=w(b).wrap("<span></span>").parent()[0])});
var d=W(a,b,a,c);return function(b,c){cb(b,"scope");for(var e=c?Ba.clone.call(a):a,j=0,g=e.length;j<g;j++){var h=e[j];(h.nodeType==1||h.nodeType==9)&&e.eq(j).data("$scope",b)}x(e,"ng-scope");c&&c(e,b);d&&d(b,e,e);return e}}function x(a,b){try{a.addClass(b)}catch(c){}}function W(a,b,c,d){function e(a,c,d,g){var h,i,k,l,o,m,u,z=[];o=0;for(m=c.length;o<m;o++)z.push(c[o]);u=o=0;for(m=j.length;o<m;u++)i=z[u],c=j[o++],h=j[o++],c?(c.scope?(k=a.$new(L(c.scope)),w(i).data("$scope",k)):k=a,(l=c.transclude)||
!g&&b?c(h,k,i,d,function(b){return function(c){var d=a.$new();d.$$transcluded=!0;return b(d,c).bind("$destroy",$a(d,d.$destroy))}}(l||b)):c(h,k,i,p,g)):h&&h(a,i.childNodes,p,g)}for(var j=[],g,h,k,i=0;i<a.length;i++)h=new ma,g=v(a[i],[],h,d),h=(g=g.length?A(g,a[i],h,b,c):null)&&g.terminal||!a[i].childNodes||!a[i].childNodes.length?null:W(a[i].childNodes,g?g.transclude:b),j.push(g),j.push(h),k=k||g||h;return k?e:null}function v(a,b,c,j){var g=c.$attr,h;switch(a.nodeType){case 1:G(b,da(hb(a).toLowerCase()),
"E",j);var i,k,l;h=a.attributes;for(var o=0,m=h&&h.length;o<m;o++)if(i=h[o],i.specified)k=i.name,l=da(k),Y.test(l)&&(k=l.substr(6).toLowerCase()),l=da(k.toLowerCase()),g[l]=k,c[l]=i=U(Z&&k=="href"?decodeURIComponent(a.getAttribute(k,2)):i.value),Fb(a,l)&&(c[l]=!0),s(a,b,i,l),G(b,l,"A",j);a=a.className;if(E(a)&&a!=="")for(;h=e.exec(a);)l=da(h[2]),G(b,l,"C",j)&&(c[l]=U(h[3])),a=a.substr(h.index+h[0].length);break;case 3:P(b,a.nodeValue);break;case 8:try{if(h=d.exec(a.nodeValue))l=da(h[1]),G(b,l,"M",
j)&&(c[l]=U(h[2]))}catch(u){}}b.sort(K);return b}function A(a,b,c,d,e){function h(a,b){if(a)a.require=s.require,z.push(a);if(b)b.require=s.require,ea.push(b)}function i(a,b){var c,d="data",e=!1;if(E(a)){for(;(c=a.charAt(0))=="^"||c=="?";)a=a.substr(1),c=="^"&&(d="inheritedData"),e=e||c=="?";c=b[d]("$"+a+"Controller");if(!c&&!e)throw Error("No controller: "+a);}else F(a)&&(c=[],n(a,function(a){c.push(i(a,b))}));return c}function k(a,d,e,g,h){var l,v,r,D,x;l=b===e?c:pc(c,new ma(w(e),c.$attr));v=l.$$element;
if(K){var y=/^\s*([@=&])(\??)\s*(\w*)\s*$/,s=d.$parent||d;n(K.scope,function(a,b){var c=a.match(y)||[],e=c[3]||b,g=c[2]=="?",c=c[1],h,k,i;d.$$isolateBindings[b]=c+e;switch(c){case "@":l.$observe(e,function(a){d[b]=a});l.$$observers[e].$$scope=s;l[e]&&(d[b]=j(l[e])(s));break;case "=":if(g&&!l[e])break;k=u(l[e]);i=k.assign||function(){h=d[b]=k(s);throw Error(Kb+l[e]+" (directive: "+K.name+")");};h=d[b]=k(s);d.$watch(function(){var a=k(s);a!==d[b]&&(a!==h?h=d[b]=a:i(s,a=h=d[b]));return a});break;case "&":k=
u(l[e]);d[b]=function(a){return k(s,a)};break;default:throw Error("Invalid isolate scope definition for directive "+K.name+": "+a);}})}q&&n(q,function(a){var b={$scope:d,$element:v,$attrs:l,$transclude:h};x=a.controller;x=="@"&&(x=l[a.name]);v.data("$"+a.name+"Controller",o(x,b))});g=0;for(r=z.length;g<r;g++)try{D=z[g],D(d,v,l,D.require&&i(D.require,v))}catch(Hc){m(Hc,va(v))}a&&a(d,e.childNodes,p,h);g=0;for(r=ea.length;g<r;g++)try{D=ea[g],D(d,v,l,D.require&&i(D.require,v))}catch(J){m(J,va(v))}}for(var l=
-Number.MAX_VALUE,z=[],ea=[],r=null,K=null,W=null,J=c.$$element=w(b),s,A,Y,G,P=d,q,na,t,B=0,C=a.length;B<C;B++){s=a[B];Y=p;if(l>s.priority)break;if(t=s.scope)O("isolated scope",K,s,J),L(t)&&(x(J,"ng-isolate-scope"),K=s),x(J,"ng-scope"),r=r||s;A=s.name;if(t=s.controller)q=q||{},O("'"+A+"' controller",q[A],s,J),q[A]=s;if(t=s.transclude)O("transclusion",G,s,J),G=s,l=s.priority,t=="element"?(Y=w(b),J=c.$$element=w(T.createComment(" "+A+": "+c[A]+" ")),b=J[0],ja(e,w(Y[0]),b),P=y(Y,d,l)):(Y=w(fb(b)).contents(),
J.html(""),P=y(Y,d));if(s.template)if(O("template",W,s,J),W=s,t=H(s.template)?s.template(J,c):s.template,t=Lb(t),s.replace){Y=w("<div>"+U(t)+"</div>").contents();b=Y[0];if(Y.length!=1||b.nodeType!==1)throw Error(g+t);ja(e,J,b);A={$attr:{}};a=a.concat(v(b,a.splice(B+1,a.length-(B+1)),A));D(c,A);C=a.length}else J.html(t);if(s.templateUrl)O("template",W,s,J),W=s,k=$(a.splice(B,a.length-B),k,J,c,e,s.replace,P),C=a.length;else if(s.compile)try{na=s.compile(J,c,P),H(na)?h(null,na):na&&h(na.pre,na.post)}catch(I){m(I,
va(J))}if(s.terminal)k.terminal=!0,l=Math.max(l,s.priority)}k.scope=r&&r.scope;k.transclude=G&&P;return k}function G(d,e,j,g){var l=!1;if(a.hasOwnProperty(e))for(var k,e=b.get(e+c),i=0,o=e.length;i<o;i++)try{if(k=e[i],(g===p||g>k.priority)&&k.restrict.indexOf(j)!=-1)d.push(k),l=!0}catch(u){m(u)}return l}function D(a,b){var c=b.$attr,d=a.$attr,e=a.$$element;n(a,function(d,e){e.charAt(0)!="$"&&(b[e]&&(d+=(e==="style"?";":" ")+b[e]),a.$set(e,d,!0,c[e]))});n(b,function(b,j){j=="class"?(x(e,b),a["class"]=
(a["class"]?a["class"]+" ":"")+b):j=="style"?e.attr("style",e.attr("style")+";"+b):j.charAt(0)!="$"&&!a.hasOwnProperty(j)&&(a[j]=b,d[j]=c[j])})}function $(a,b,c,d,e,j,h){var i=[],o,m,u=c[0],z=a.shift(),r=t({},z,{controller:null,templateUrl:null,transclude:null,scope:null}),z=H(z.templateUrl)?z.templateUrl(c,d):z.templateUrl;c.html("");k.get(z,{cache:l}).success(function(l){var k,z,l=Lb(l);if(j){z=w("<div>"+U(l)+"</div>").contents();k=z[0];if(z.length!=1||k.nodeType!==1)throw Error(g+l);l={$attr:{}};
ja(e,c,k);v(k,a,l);D(d,l)}else k=u,c.html(l);a.unshift(r);o=A(a,k,d,h);for(m=W(c[0].childNodes,h);i.length;){var ea=i.shift(),l=i.shift();z=i.shift();var x=i.shift(),y=k;l!==u&&(y=fb(k),ja(z,w(l),y));o(function(){b(m,ea,y,e,x)},ea,y,e,x)}i=null}).error(function(a,b,c,d){throw Error("Failed to load template: "+d.url);});return function(a,c,d,e,j){i?(i.push(c),i.push(d),i.push(e),i.push(j)):o(function(){b(m,c,d,e,j)},c,d,e,j)}}function K(a,b){return b.priority-a.priority}function O(a,b,c,d){if(b)throw Error("Multiple directives ["+
b.name+", "+c.name+"] asking for "+a+" on: "+va(d));}function P(a,b){var c=j(b,!0);c&&a.push({priority:0,compile:S(function(a,b){var d=b.parent(),e=d.data("$binding")||[];e.push(c);x(d.data("$binding",e),"ng-binding");a.$watch(c,function(a){b[0].nodeValue=a})})})}function s(a,b,c,d){var e=j(c,!0);e&&b.push({priority:100,compile:S(function(a,b,c){b=c.$$observers||(c.$$observers={});if(e=j(c[d],!0))c[d]=e(a),(b[d]||(b[d]=[])).$$inter=!0,(c.$$observers&&c.$$observers[d].$$scope||a).$watch(e,function(a){c.$set(d,
a)})})})}function ja(a,b,c){var d=b[0],e=d.parentNode,j,g;if(a){j=0;for(g=a.length;j<g;j++)if(a[j]==d){a[j]=c;break}}e&&e.replaceChild(c,d);c[w.expando]=d[w.expando];b[0]=c}var ma=function(a,b){this.$$element=a;this.$attr=b||{}};ma.prototype={$normalize:da,$set:function(a,b,c,d){var e=Fb(this.$$element[0],a),j=this.$$observers;e&&(this.$$element.prop(a,b),d=e);this[a]=b;d?this.$attr[a]=d:(d=this.$attr[a])||(this.$attr[a]=d=bb(a,"-"));if(hb(this.$$element[0])==="A"&&a==="href")q.setAttribute("href",
b),e=q.href,e.match(i)||(this[a]=b="unsafe:"+e);c!==!1&&(b===null||b===p?this.$$element.removeAttr(d):this.$$element.attr(d,b));j&&n(j[a],function(a){try{a(b)}catch(c){m(c)}})},$observe:function(a,b){var c=this,d=c.$$observers||(c.$$observers={}),e=d[a]||(d[a]=[]);e.push(b);z.$evalAsync(function(){e.$$inter||b(c[a])});return b}};var q=r[0].createElement("a"),ea=j.startSymbol(),J=j.endSymbol(),Lb=ea=="{{"||J=="}}"?qa:function(a){return a.replace(/\{\{/g,ea).replace(/}}/g,J)},Y=/^ngAttr[A-Z]/;return y}]}
function da(b){return Ia(b.replace(Ic,""))}function Jc(){var b={},a=/^(\S+)(\s+as\s+(\w+))?$/;this.register=function(a,d){L(a)?t(b,a):b[a]=d};this.$get=["$injector","$window",function(c,d){return function(e,g){var i,f;E(e)&&(f=e.match(a),i=f[1],f=f[3],e=b.hasOwnProperty(i)?b[i]:ib(g.$scope,i,!0)||ib(d,i,!0),xa(e,i,!0));i=c.instantiate(e,g);if(f){if(typeof g.$scope!=="object")throw Error('Can not export controller as "'+f+'". No scope object provided!');g.$scope[f]=i}return i}}]}function Kc(){this.$get=
["$window",function(b){return w(b.document)}]}function Lc(){this.$get=["$log",function(b){return function(a,c){b.error.apply(b,arguments)}}]}function Mc(){var b="{{",a="}}";this.startSymbol=function(a){return a?(b=a,this):b};this.endSymbol=function(b){return b?(a=b,this):a};this.$get=["$parse","$exceptionHandler",function(c,d){function e(e,h){for(var j,m,k=0,l=[],u=e.length,o=!1,z=[];k<u;)(j=e.indexOf(b,k))!=-1&&(m=e.indexOf(a,j+g))!=-1?(k!=j&&l.push(e.substring(k,j)),l.push(k=c(o=e.substring(j+g,
m))),k.exp=o,k=m+i,o=!0):(k!=u&&l.push(e.substring(k)),k=u);if(!(u=l.length))l.push(""),u=1;if(!h||o)return z.length=u,k=function(a){try{for(var b=0,c=u,j;b<c;b++){if(typeof(j=l[b])=="function")j=j(a),j==null||j==p?j="":typeof j!="string"&&(j=ha(j));z[b]=j}return z.join("")}catch(g){d(Error("Error while interpolating: "+e+"\n"+g.toString()))}},k.exp=e,k.parts=l,k}var g=b.length,i=a.length;e.startSymbol=function(){return b};e.endSymbol=function(){return a};return e}]}function Mb(b){for(var b=b.split("/"),
a=b.length;a--;)b[a]=ab(b[a]);return b.join("/")}function Nb(b,a){var c=jb.exec(b);a.$$protocol=c[1];a.$$host=c[3];a.$$port=N(c[5])||Oa[c[1]]||null}function Ob(b,a){var c=Pb.exec(b);a.$$path=decodeURIComponent(c[1]);a.$$search=vb(c[3]);a.$$hash=decodeURIComponent(c[5]||"");if(a.$$path&&a.$$path.charAt(0)!="/")a.$$path="/"+a.$$path}function fa(b,a,c){return a.indexOf(b)==0?a.substr(b.length):c}function Ca(b){var a=b.indexOf("#");return a==-1?b:b.substr(0,a)}function kb(b){return b.substr(0,Ca(b).lastIndexOf("/")+
1)}function Qb(b,a){var a=a||"",c=kb(b);this.$$parse=function(a){var b={};Nb(a,b);var g=fa(c,a);if(!E(g))throw Error('Invalid url "'+a+'", missing path prefix "'+c+'".');Ob(g,b);t(this,b);if(!this.$$path)this.$$path="/";this.$$compose()};this.$$compose=function(){var a=wb(this.$$search),b=this.$$hash?"#"+ab(this.$$hash):"";this.$$url=Mb(this.$$path)+(a?"?"+a:"")+b;this.$$absUrl=c+this.$$url.substr(1)};this.$$rewrite=function(d){var e;if((e=fa(b,d))!==p)return d=e,(e=fa(a,e))!==p?c+(fa("/",e)||e):
b+d;else if((e=fa(c,d))!==p)return c+e;else if(c==d+"/")return c}}function lb(b,a){var c=kb(b);this.$$parse=function(d){Nb(d,this);var e=fa(b,d)||fa(c,d);if(!E(e))throw Error('Invalid url "'+d+'", does not start with "'+b+'".');e=e.charAt(0)=="#"?fa(a,e):e;if(!E(e))throw Error('Invalid url "'+d+'", missing hash prefix "'+a+'".');Ob(e,this);this.$$compose()};this.$$compose=function(){var c=wb(this.$$search),e=this.$$hash?"#"+ab(this.$$hash):"";this.$$url=Mb(this.$$path)+(c?"?"+c:"")+e;this.$$absUrl=
b+(this.$$url?a+this.$$url:"")};this.$$rewrite=function(a){if(Ca(b)==Ca(a))return a}}function Rb(b,a){lb.apply(this,arguments);var c=kb(b);this.$$rewrite=function(d){var e;if(b==Ca(d))return d;else if(e=fa(c,d))return b+a+e;else if(c===d+"/")return c}}function Pa(b){return function(){return this[b]}}function Sb(b,a){return function(c){if(C(c))return this[b];this[b]=a(c);this.$$compose();return this}}function Nc(){var b="",a=!1;this.hashPrefix=function(a){return B(a)?(b=a,this):b};this.html5Mode=function(b){return B(b)?
(a=b,this):a};this.$get=["$rootScope","$browser","$sniffer","$rootElement",function(c,d,e,g){function i(a){c.$broadcast("$locationChangeSuccess",f.absUrl(),a)}var f,h=d.baseHref(),j=d.url();a?(h=h?j.substring(0,j.indexOf("/",j.indexOf("//")+2))+h:j,e=e.history?Qb:Rb):(h=Ca(j),e=lb);f=new e(h,"#"+b);f.$$parse(f.$$rewrite(j));g.bind("click",function(a){if(!a.ctrlKey&&!(a.metaKey||a.which==2)){for(var b=w(a.target);I(b[0].nodeName)!=="a";)if(b[0]===g[0]||!(b=b.parent())[0])return;var e=b.prop("href"),
j=f.$$rewrite(e);e&&!b.attr("target")&&j&&!a.isDefaultPrevented()&&(a.preventDefault(),j!=d.url()&&(f.$$parse(j),c.$apply(),M.angular["ff-684208-preventDefault"]=!0))}});f.absUrl()!=j&&d.url(f.absUrl(),!0);d.onUrlChange(function(a){f.absUrl()!=a&&(c.$broadcast("$locationChangeStart",a,f.absUrl()).defaultPrevented?d.url(f.absUrl()):(c.$evalAsync(function(){var b=f.absUrl();f.$$parse(a);i(b)}),c.$$phase||c.$digest()))});var m=0;c.$watch(function(){var a=d.url(),b=f.$$replace;if(!m||a!=f.absUrl())m++,
c.$evalAsync(function(){c.$broadcast("$locationChangeStart",f.absUrl(),a).defaultPrevented?f.$$parse(a):(d.url(f.absUrl(),b),i(a))});f.$$replace=!1;return m});return f}]}function Oc(){var b=!0,a=this;this.debugEnabled=function(a){return B(a)?(b=a,this):b};this.$get=["$window",function(c){function d(a){a instanceof Error&&(a.stack?a=a.message&&a.stack.indexOf(a.message)===-1?"Error: "+a.message+"\n"+a.stack:a.stack:a.sourceURL&&(a=a.message+"\n"+a.sourceURL+":"+a.line));return a}function e(a){var b=
c.console||{},e=b[a]||b.log||q;return e.apply?function(){var a=[];n(arguments,function(b){a.push(d(b))});return e.apply(b,a)}:function(a,b){e(a,b)}}return{log:e("log"),warn:e("warn"),info:e("info"),error:e("error"),debug:function(){var c=e("debug");return function(){b&&c.apply(a,arguments)}}()}}]}function Pc(b,a){function c(a){return a.indexOf(r)!=-1}function d(a){a=a||1;return o+a<b.length?b.charAt(o+a):!1}function e(a){return"0"<=a&&a<="9"}function g(a){return a==" "||a=="\r"||a=="\t"||a=="\n"||
a=="\u000b"||a=="\u00a0"}function i(a){return"a"<=a&&a<="z"||"A"<=a&&a<="Z"||"_"==a||a=="$"}function f(a){return a=="-"||a=="+"||e(a)}function h(a,c,d){d=d||o;throw Error("Lexer Error: "+a+" at column"+(B(c)?"s "+c+"-"+o+" ["+b.substring(c,d)+"]":" "+d)+" in expression ["+b+"].");}function j(){for(var a="",c=o;o<b.length;){var j=I(b.charAt(o));if(j=="."||e(j))a+=j;else{var g=d();if(j=="e"&&f(g))a+=j;else if(f(j)&&g&&e(g)&&a.charAt(a.length-1)=="e")a+=j;else if(f(j)&&(!g||!e(g))&&a.charAt(a.length-
1)=="e")h("Invalid exponent");else break}o++}a*=1;l.push({index:c,text:a,json:!0,fn:function(){return a}})}function m(){for(var c="",d=o,f,j,h,k;o<b.length;){k=b.charAt(o);if(k=="."||i(k)||e(k))k=="."&&(f=o),c+=k;else break;o++}if(f)for(j=o;j<b.length;){k=b.charAt(j);if(k=="("){h=c.substr(f-d+1);c=c.substr(0,f-d);o=j;break}if(g(k))j++;else break}d={index:d,text:c};if(Da.hasOwnProperty(c))d.fn=d.json=Da[c];else{var m=Tb(c,a);d.fn=t(function(a,b){return m(a,b)},{assign:function(a,b){return Ub(a,c,b)}})}l.push(d);
h&&(l.push({index:f,text:".",json:!1}),l.push({index:f+1,text:h,json:!1}))}function k(a){var c=o;o++;for(var d="",e=a,f=!1;o<b.length;){var j=b.charAt(o);e+=j;if(f)j=="u"?(j=b.substring(o+1,o+5),j.match(/[\da-f]{4}/i)||h("Invalid unicode escape [\\u"+j+"]"),o+=4,d+=String.fromCharCode(parseInt(j,16))):(f=Qc[j],d+=f?f:j),f=!1;else if(j=="\\")f=!0;else if(j==a){o++;l.push({index:c,text:e,string:d,json:!0,fn:function(){return d}});return}else d+=j;o++}h("Unterminated quote",c)}for(var l=[],u,o=0,z=[],
r,y=":";o<b.length;){r=b.charAt(o);if(c("\"'"))k(r);else if(e(r)||c(".")&&e(d()))j();else if(i(r)){if(m(),"{,".indexOf(y)!=-1&&z[0]=="{"&&(u=l[l.length-1]))u.json=u.text.indexOf(".")==-1}else if(c("(){}[].,;:?"))l.push({index:o,text:r,json:":[,".indexOf(y)!=-1&&c("{[")||c("}]:,")}),c("{[")&&z.unshift(r),c("}]")&&z.shift(),o++;else if(g(r)){o++;continue}else{var x=r+d(),n=x+d(2),v=Da[r],A=Da[x],G=Da[n];G?(l.push({index:o,text:n,fn:G}),o+=3):A?(l.push({index:o,text:x,fn:A}),o+=2):v?(l.push({index:o,
text:r,fn:v,json:"[,:".indexOf(y)!=-1&&c("+-")}),o+=1):h("Unexpected next character ",o,o+1)}y=r}return l}function Rc(b,a,c,d){function e(a,c){throw Error("Syntax Error: Token '"+c.text+"' "+a+" at column "+(c.index+1)+" of the expression ["+b+"] starting at ["+b.substring(c.index)+"].");}function g(){if(O.length===0)throw Error("Unexpected end of expression: "+b);return O[0]}function i(a,b,c,d){if(O.length>0){var e=O[0],f=e.text;if(f==a||f==b||f==c||f==d||!a&&!b&&!c&&!d)return e}return!1}function f(b,
c,d,f){return(b=i(b,c,d,f))?(a&&!b.json&&e("is not valid json",b),O.shift(),b):!1}function h(a){f(a)||e("is unexpected, expecting ["+a+"]",i())}function j(a,b){return t(function(c,d){return a(c,d,b)},{constant:b.constant})}function m(a,b,c){return t(function(d,e){return a(d,e)?b(d,e):c(d,e)},{constant:a.constant&&b.constant&&c.constant})}function k(a,b,c){return t(function(d,e){return b(d,e,a,c)},{constant:a.constant&&c.constant})}function l(){for(var a=[];;)if(O.length>0&&!i("}",")",";","]")&&a.push(w()),
!f(";"))return a.length==1?a[0]:function(b,c){for(var d,e=0;e<a.length;e++){var f=a[e];f&&(d=f(b,c))}return d}}function u(){for(var a=f(),b=c(a.text),d=[];;)if(a=f(":"))d.push(P());else{var e=function(a,c,e){for(var e=[e],f=0;f<d.length;f++)e.push(d[f](a,c));return b.apply(a,e)};return function(){return e}}}function o(){var a=z(),b,c;if(f("?"))if(b=o(),c=f(":"))return m(a,b,o());else e("expected :",c);else return a}function z(){for(var a=r(),b;;)if(b=f("||"))a=k(a,b.fn,r());else return a}function r(){var a=
y(),b;if(b=f("&&"))a=k(a,b.fn,r());return a}function y(){var a=x(),b;if(b=f("==","!=","===","!=="))a=k(a,b.fn,y());return a}function x(){var a;a=n();for(var b;b=f("+","-");)a=k(a,b.fn,n());if(b=f("<",">","<=",">="))a=k(a,b.fn,x());return a}function n(){for(var a=v(),b;b=f("*","/","%");)a=k(a,b.fn,v());return a}function v(){var a;return f("+")?A():(a=f("-"))?k($,a.fn,v()):(a=f("!"))?j(a.fn,v()):A()}function A(){var a;if(f("("))a=w(),h(")");else if(f("["))a=G();else if(f("{"))a=D();else{var b=f();(a=
b.fn)||e("not a primary expression",b);if(b.json)a.constant=a.literal=!0}for(var c;b=f("(","[",".");)b.text==="("?(a=s(a,c),c=null):b.text==="["?(c=a,a=ma(a)):b.text==="."?(c=a,a=ja(a)):e("IMPOSSIBLE");return a}function G(){var a=[],b=!0;if(g().text!="]"){do{var c=P();a.push(c);c.constant||(b=!1)}while(f(","))}h("]");return t(function(b,c){for(var d=[],e=0;e<a.length;e++)d.push(a[e](b,c));return d},{literal:!0,constant:b})}function D(){var a=[],b=!0;if(g().text!="}"){do{var c=f(),c=c.string||c.text;
h(":");var d=P();a.push({key:c,value:d});d.constant||(b=!1)}while(f(","))}h("}");return t(function(b,c){for(var d={},e=0;e<a.length;e++){var f=a[e];d[f.key]=f.value(b,c)}return d},{literal:!0,constant:b})}var $=S(0),K,O=Pc(b,d),P=function(){var a=o(),c,d;return(d=f("="))?(a.assign||e("implies assignment but ["+b.substring(0,d.index)+"] can not be assigned to",d),c=o(),function(b,d){return a.assign(b,c(b,d),d)}):a},s=function(a,b){var c=[];if(g().text!=")"){do c.push(P());while(f(","))}h(")");return function(d,
e){for(var f=[],j=b?b(d,e):d,g=0;g<c.length;g++)f.push(c[g](d,e));g=a(d,e,j)||q;return g.apply?g.apply(j,f):g(f[0],f[1],f[2],f[3],f[4])}},ja=function(a){var b=f().text,c=Tb(b,d);return t(function(b,d,e){return c(e||a(b,d),d)},{assign:function(c,d,e){return Ub(a(c,e),b,d)}})},ma=function(a){var b=P();h("]");return t(function(c,d){var e=a(c,d),f=b(c,d),j;if(!e)return p;if((e=e[f])&&e.then){j=e;if(!("$$v"in e))j.$$v=p,j.then(function(a){j.$$v=a});e=e.$$v}return e},{assign:function(c,d,e){return a(c,
e)[b(c,e)]=d}})},w=function(){for(var a=P(),b;;)if(b=f("|"))a=k(a,b.fn,u());else return a};a?(P=z,s=ja=ma=w=function(){e("is not valid json",{text:b,index:0})},K=A()):K=l();O.length!==0&&e("is an unexpected token",O[0]);K.literal=!!K.literal;K.constant=!!K.constant;return K}function Ub(b,a,c){for(var a=a.split("."),d=0;a.length>1;d++){var e=a.shift(),g=b[e];g||(g={},b[e]=g);b=g}return b[a.shift()]=c}function ib(b,a,c){if(!a)return b;for(var a=a.split("."),d,e=b,g=a.length,i=0;i<g;i++)d=a[i],b&&(b=
(e=b)[d]);return!c&&H(b)?$a(e,b):b}function Vb(b,a,c,d,e){return function(g,i){var f=i&&i.hasOwnProperty(b)?i:g,h;if(f===null||f===p)return f;if((f=f[b])&&f.then){if(!("$$v"in f))h=f,h.$$v=p,h.then(function(a){h.$$v=a});f=f.$$v}if(!a||f===null||f===p)return f;if((f=f[a])&&f.then){if(!("$$v"in f))h=f,h.$$v=p,h.then(function(a){h.$$v=a});f=f.$$v}if(!c||f===null||f===p)return f;if((f=f[c])&&f.then){if(!("$$v"in f))h=f,h.$$v=p,h.then(function(a){h.$$v=a});f=f.$$v}if(!d||f===null||f===p)return f;if((f=
f[d])&&f.then){if(!("$$v"in f))h=f,h.$$v=p,h.then(function(a){h.$$v=a});f=f.$$v}if(!e||f===null||f===p)return f;if((f=f[e])&&f.then){if(!("$$v"in f))h=f,h.$$v=p,h.then(function(a){h.$$v=a});f=f.$$v}return f}}function Tb(b,a){if(mb.hasOwnProperty(b))return mb[b];var c=b.split("."),d=c.length,e;if(a)e=d<6?Vb(c[0],c[1],c[2],c[3],c[4]):function(a,b){var e=0,j;do j=Vb(c[e++],c[e++],c[e++],c[e++],c[e++])(a,b),b=p,a=j;while(e<d);return j};else{var g="var l, fn, p;\n";n(c,function(a,b){g+="if(s === null || s === undefined) return s;\nl=s;\ns="+
(b?"s":'((k&&k.hasOwnProperty("'+a+'"))?k:s)')+'["'+a+'"];\nif (s && s.then) {\n if (!("$$v" in s)) {\n p=s;\n p.$$v = undefined;\n p.then(function(v) {p.$$v=v;});\n}\n s=s.$$v\n}\n'});g+="return s;";e=Function("s","k",g);e.toString=function(){return g}}return mb[b]=e}function Sc(){var b={};this.$get=["$filter","$sniffer",function(a,c){return function(d){switch(typeof d){case "string":return b.hasOwnProperty(d)?b[d]:b[d]=Rc(d,!1,a,c.csp);case "function":return d;default:return q}}}]}function Tc(){this.$get=
["$rootScope","$exceptionHandler",function(b,a){return Uc(function(a){b.$evalAsync(a)},a)}]}function Uc(b,a){function c(a){return a}function d(a){return i(a)}var e=function(){var f=[],h,j;return j={resolve:function(a){if(f){var c=f;f=p;h=g(a);c.length&&b(function(){for(var a,b=0,d=c.length;b<d;b++)a=c[b],h.then(a[0],a[1])})}},reject:function(a){j.resolve(i(a))},promise:{then:function(b,j){var g=e(),i=function(d){try{g.resolve((b||c)(d))}catch(e){a(e),g.reject(e)}},o=function(b){try{g.resolve((j||
d)(b))}catch(c){a(c),g.reject(c)}};f?f.push([i,o]):h.then(i,o);return g.promise},always:function(a){function b(a,c){var d=e();c?d.resolve(a):d.reject(a);return d.promise}function d(e,f){var j=null;try{j=(a||c)()}catch(g){return b(g,!1)}return j&&j.then?j.then(function(){return b(e,f)},function(a){return b(a,!1)}):b(e,f)}return this.then(function(a){return d(a,!0)},function(a){return d(a,!1)})}}}},g=function(a){return a&&a.then?a:{then:function(c){var d=e();b(function(){d.resolve(c(a))});return d.promise}}},
i=function(a){return{then:function(c,j){var g=e();b(function(){g.resolve((j||d)(a))});return g.promise}}};return{defer:e,reject:i,when:function(f,h,j){var m=e(),k,l=function(b){try{return(h||c)(b)}catch(d){return a(d),i(d)}},u=function(b){try{return(j||d)(b)}catch(c){return a(c),i(c)}};b(function(){g(f).then(function(a){k||(k=!0,m.resolve(g(a).then(l,u)))},function(a){k||(k=!0,m.resolve(u(a)))})});return m.promise},all:function(a){var b=e(),c=0,d=F(a)?[]:{};n(a,function(a,e){c++;g(a).then(function(a){d.hasOwnProperty(e)||
(d[e]=a,--c||b.resolve(d))},function(a){d.hasOwnProperty(e)||b.reject(a)})});c===0&&b.resolve(d);return b.promise}}}function Vc(){var b={};this.when=function(a,c){b[a]=t({reloadOnSearch:!0,caseInsensitiveMatch:!1},c);if(a){var d=a[a.length-1]=="/"?a.substr(0,a.length-1):a+"/";b[d]={redirectTo:a}}return this};this.otherwise=function(a){this.when(null,a);return this};this.$get=["$rootScope","$location","$routeParams","$q","$injector","$http","$templateCache",function(a,c,d,e,g,i,f){function h(a,b,c){for(var b=
"^"+b.replace(/[-\/\\^$:*+?.()|[\]{}]/g,"\\$&")+"$",d="",e=[],f={},j=/\\([:*])(\w+)/g,g,i=0;(g=j.exec(b))!==null;){d+=b.slice(i,g.index);switch(g[1]){case ":":d+="([^\\/]*)";break;case "*":d+="(.*)"}e.push(g[2]);i=j.lastIndex}d+=b.substr(i);var h=a.match(RegExp(d,c.caseInsensitiveMatch?"i":""));h&&n(e,function(a,b){f[a]=h[b+1]});return h?f:null}function j(){var b=m(),j=u.current;if(b&&j&&b.$$route===j.$$route&&ia(b.pathParams,j.pathParams)&&!b.reloadOnSearch&&!l)j.params=b.params,V(j.params,d),a.$broadcast("$routeUpdate",
j);else if(b||j)l=!1,a.$broadcast("$routeChangeStart",b,j),(u.current=b)&&b.redirectTo&&(E(b.redirectTo)?c.path(k(b.redirectTo,b.params)).search(b.params).replace():c.url(b.redirectTo(b.pathParams,c.path(),c.search())).replace()),e.when(b).then(function(){if(b){var a=t({},b.resolve),c;n(a,function(b,c){a[c]=E(b)?g.get(b):g.invoke(b)});if(B(c=b.template))H(c)&&(c=c(b.params));else if(B(c=b.templateUrl))if(H(c)&&(c=c(b.params)),B(c))b.loadedTemplateUrl=c,c=i.get(c,{cache:f}).then(function(a){return a.data});
B(c)&&(a.$template=c);return e.all(a)}}).then(function(c){if(b==u.current){if(b)b.locals=c,V(b.params,d);a.$broadcast("$routeChangeSuccess",b,j)}},function(c){b==u.current&&a.$broadcast("$routeChangeError",b,j,c)})}function m(){var a,d;n(b,function(b,e){if(!d&&(a=h(c.path(),e,b)))d=tb(b,{params:t({},c.search(),a),pathParams:a}),d.$$route=b});return d||b[null]&&tb(b[null],{params:{},pathParams:{}})}function k(a,b){var c=[];n((a||"").split(":"),function(a,d){if(d==0)c.push(a);else{var e=a.match(/(\w+)(.*)/),
f=e[1];c.push(b[f]);c.push(e[2]||"");delete b[f]}});return c.join("")}var l=!1,u={routes:b,reload:function(){l=!0;a.$evalAsync(j)}};a.$on("$locationChangeSuccess",j);return u}]}function Wc(){this.$get=S({})}function Xc(){var b=10;this.digestTtl=function(a){arguments.length&&(b=a);return b};this.$get=["$injector","$exceptionHandler","$parse",function(a,c,d){function e(){this.$id=Fa();this.$$phase=this.$parent=this.$$watchers=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null;
this["this"]=this.$root=this;this.$$destroyed=!1;this.$$asyncQueue=[];this.$$listeners={};this.$$isolateBindings={}}function g(a){if(h.$$phase)throw Error(h.$$phase+" already in progress");h.$$phase=a}function i(a,b){var c=d(a);xa(c,b);return c}function f(){}e.prototype={$new:function(a){if(H(a))throw Error("API-CHANGE: Use $controller to instantiate controllers.");a?(a=new e,a.$root=this.$root):(a=function(){},a.prototype=this,a=new a,a.$id=Fa());a["this"]=a;a.$$listeners={};a.$parent=this;a.$$watchers=
a.$$nextSibling=a.$$childHead=a.$$childTail=null;a.$$prevSibling=this.$$childTail;this.$$childHead?this.$$childTail=this.$$childTail.$$nextSibling=a:this.$$childHead=this.$$childTail=a;return a},$watch:function(a,b,c){var d=i(a,"watch"),e=this.$$watchers,g={fn:b,last:f,get:d,exp:a,eq:!!c};if(!H(b)){var h=i(b||q,"listener");g.fn=function(a,b,c){h(c)}}if(typeof a=="string"&&d.constant){var r=g.fn;g.fn=function(a,b,c){r.call(this,a,b,c);ta(e,g)}}if(!e)e=this.$$watchers=[];e.unshift(g);return function(){ta(e,
g)}},$watchCollection:function(a,b){var c=this,e,f,g=0,i=d(a),h=[],n={},x=0;return this.$watch(function(){f=i(c);var a,b;if(L(f))if(Xa(f)){if(e!==h)e=h,x=e.length=0,g++;a=f.length;if(x!==a)g++,e.length=x=a;for(b=0;b<a;b++)e[b]!==f[b]&&(g++,e[b]=f[b])}else{e!==n&&(e=n={},x=0,g++);a=0;for(b in f)f.hasOwnProperty(b)&&(a++,e.hasOwnProperty(b)?e[b]!==f[b]&&(g++,e[b]=f[b]):(x++,e[b]=f[b],g++));if(x>a)for(b in g++,e)e.hasOwnProperty(b)&&!f.hasOwnProperty(b)&&(x--,delete e[b])}else e!==f&&(e=f,g++);return g},
function(){b(f,e,c)})},$digest:function(){var a,d,e,i,u=this.$$asyncQueue,o,z,r=b,n,x=[],p,v;g("$digest");do{z=!1;for(n=this;u.length;)try{n.$eval(u.shift())}catch(A){c(A)}do{if(i=n.$$watchers)for(o=i.length;o--;)try{if(a=i[o],(d=a.get(n))!==(e=a.last)&&!(a.eq?ia(d,e):typeof d=="number"&&typeof e=="number"&&isNaN(d)&&isNaN(e)))z=!0,a.last=a.eq?V(d):d,a.fn(d,e===f?d:e,n),r<5&&(p=4-r,x[p]||(x[p]=[]),v=H(a.exp)?"fn: "+(a.exp.name||a.exp.toString()):a.exp,v+="; newVal: "+ha(d)+"; oldVal: "+ha(e),x[p].push(v))}catch(G){c(G)}if(!(i=
n.$$childHead||n!==this&&n.$$nextSibling))for(;n!==this&&!(i=n.$$nextSibling);)n=n.$parent}while(n=i);if(z&&!r--)throw h.$$phase=null,Error(b+" $digest() iterations reached. Aborting!\nWatchers fired in the last 5 iterations: "+ha(x));}while(z||u.length);h.$$phase=null},$destroy:function(){if(!(h==this||this.$$destroyed)){var a=this.$parent;this.$broadcast("$destroy");this.$$destroyed=!0;if(a.$$childHead==this)a.$$childHead=this.$$nextSibling;if(a.$$childTail==this)a.$$childTail=this.$$prevSibling;
if(this.$$prevSibling)this.$$prevSibling.$$nextSibling=this.$$nextSibling;if(this.$$nextSibling)this.$$nextSibling.$$prevSibling=this.$$prevSibling;this.$parent=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null}},$eval:function(a,b){return d(a)(this,b)},$evalAsync:function(a){this.$$asyncQueue.push(a)},$apply:function(a){try{return g("$apply"),this.$eval(a)}catch(b){c(b)}finally{h.$$phase=null;try{h.$digest()}catch(d){throw c(d),d;}}},$on:function(a,b){var c=this.$$listeners[a];
c||(this.$$listeners[a]=c=[]);c.push(b);return function(){c[Ga(c,b)]=null}},$emit:function(a,b){var d=[],e,f=this,g=!1,i={name:a,targetScope:f,stopPropagation:function(){g=!0},preventDefault:function(){i.defaultPrevented=!0},defaultPrevented:!1},h=[i].concat(ka.call(arguments,1)),n,x;do{e=f.$$listeners[a]||d;i.currentScope=f;n=0;for(x=e.length;n<x;n++)if(e[n])try{if(e[n].apply(null,h),g)return i}catch(p){c(p)}else e.splice(n,1),n--,x--;f=f.$parent}while(f);return i},$broadcast:function(a,b){var d=
this,e=this,f={name:a,targetScope:this,preventDefault:function(){f.defaultPrevented=!0},defaultPrevented:!1},g=[f].concat(ka.call(arguments,1)),i,h;do{d=e;f.currentScope=d;e=d.$$listeners[a]||[];i=0;for(h=e.length;i<h;i++)if(e[i])try{e[i].apply(null,g)}catch(n){c(n)}else e.splice(i,1),i--,h--;if(!(e=d.$$childHead||d!==this&&d.$$nextSibling))for(;d!==this&&!(e=d.$$nextSibling);)d=d.$parent}while(d=e);return f}};var h=new e;return h}]}function Yc(){this.$get=["$window","$document",function(b,a){var c=
{},d=N((/android (\d+)/.exec(I((b.navigator||{}).userAgent))||[])[1]),e=a[0]||{},g,i=/^(Moz|webkit|O|ms)(?=[A-Z])/,f=e.body&&e.body.style,h=!1,j=!1;if(f){for(var m in f)if(h=i.exec(m)){g=h[0];g=g.substr(0,1).toUpperCase()+g.substr(1);break}h=!!("transition"in f||g+"Transition"in f);j=!!("animation"in f||g+"Animation"in f)}return{history:!(!b.history||!b.history.pushState||d<4),hashchange:"onhashchange"in b&&(!e.documentMode||e.documentMode>7),hasEvent:function(a){if(a=="input"&&Z==9)return!1;if(C(c[a])){var b=
e.createElement("div");c[a]="on"+a in b}return c[a]},csp:e.securityPolicy?e.securityPolicy.isActive:!1,vendorPrefix:g,transitions:h,animations:j}}]}function Zc(){this.$get=S(M)}function Wb(b){var a={},c,d,e;if(!b)return a;n(b.split("\n"),function(b){e=b.indexOf(":");c=I(U(b.substr(0,e)));d=U(b.substr(e+1));c&&(a[c]?a[c]+=", "+d:a[c]=d)});return a}function $c(b,a){var c=ad.exec(b);if(c==null)return!0;var d={protocol:c[2],host:c[4],port:N(c[6])||Oa[c[2]]||null,relativeProtocol:c[2]===p||c[2]===""},
c=jb.exec(a),c={protocol:c[1],host:c[3],port:N(c[5])||Oa[c[1]]||null};return(d.protocol==c.protocol||d.relativeProtocol)&&d.host==c.host&&(d.port==c.port||d.relativeProtocol&&c.port==Oa[c.protocol])}function Xb(b){var a=L(b)?b:p;return function(c){a||(a=Wb(b));return c?a[I(c)]||null:a}}function Yb(b,a,c){if(H(c))return c(b,a);n(c,function(c){b=c(b,a)});return b}function bd(){var b=/^\s*(\[|\{[^\{])/,a=/[\}\]]\s*$/,c=/^\)\]\}',?\n/,d={"Content-Type":"application/json;charset=utf-8"},e=this.defaults=
{transformResponse:[function(d){E(d)&&(d=d.replace(c,""),b.test(d)&&a.test(d)&&(d=ub(d,!0)));return d}],transformRequest:[function(a){return L(a)&&Ea.apply(a)!=="[object File]"?ha(a):a}],headers:{common:{Accept:"application/json, text/plain, */*"},post:d,put:d,patch:d},xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN"},g=this.interceptors=[],i=this.responseInterceptors=[];this.$get=["$httpBackend","$browser","$cacheFactory","$rootScope","$q","$injector",function(a,b,c,d,k,l){function u(a){function c(a){var b=
t({},a,{data:Yb(a.data,a.headers,d.transformResponse)});return 200<=a.status&&a.status<300?b:k.reject(b)}var d={transformRequest:e.transformRequest,transformResponse:e.transformResponse},f={};t(d,a);d.headers=f;d.method=oa(d.method);t(f,e.headers.common,e.headers[I(d.method)],a.headers);(a=$c(d.url,b.url())?b.cookies()[d.xsrfCookieName||e.xsrfCookieName]:p)&&(f[d.xsrfHeaderName||e.xsrfHeaderName]=a);var g=[function(a){var b=Yb(a.data,Xb(f),a.transformRequest);C(a.data)&&delete f["Content-Type"];if(C(a.withCredentials)&&
!C(e.withCredentials))a.withCredentials=e.withCredentials;return o(a,b,f).then(c,c)},p],j=k.when(d);for(n(y,function(a){(a.request||a.requestError)&&g.unshift(a.request,a.requestError);(a.response||a.responseError)&&g.push(a.response,a.responseError)});g.length;)var a=g.shift(),i=g.shift(),j=j.then(a,i);j.success=function(a){j.then(function(b){a(b.data,b.status,b.headers,d)});return j};j.error=function(a){j.then(null,function(b){a(b.data,b.status,b.headers,d)});return j};return j}function o(b,c,g){function j(a,
b,c){n&&(200<=a&&a<300?n.put(s,[a,b,Wb(c)]):n.remove(s));i(b,a,c);d.$$phase||d.$apply()}function i(a,c,d){c=Math.max(c,0);(200<=c&&c<300?l.resolve:l.reject)({data:a,status:c,headers:Xb(d),config:b})}function h(){var a=Ga(u.pendingRequests,b);a!==-1&&u.pendingRequests.splice(a,1)}var l=k.defer(),o=l.promise,n,p,s=z(b.url,b.params);u.pendingRequests.push(b);o.then(h,h);if((b.cache||e.cache)&&b.cache!==!1&&b.method=="GET")n=L(b.cache)?b.cache:L(e.cache)?e.cache:r;if(n)if(p=n.get(s))if(p.then)return p.then(h,
h),p;else F(p)?i(p[1],p[0],V(p[2])):i(p,200,{});else n.put(s,o);p||a(b.method,s,c,j,g,b.timeout,b.withCredentials,b.responseType);return o}function z(a,b){if(!b)return a;var c=[];nc(b,function(a,b){a==null||a==p||(F(a)||(a=[a]),n(a,function(a){L(a)&&(a=ha(a));c.push(wa(b)+"="+wa(a))}))});return a+(a.indexOf("?")==-1?"?":"&")+c.join("&")}var r=c("$http"),y=[];n(g,function(a){y.unshift(E(a)?l.get(a):l.invoke(a))});n(i,function(a,b){var c=E(a)?l.get(a):l.invoke(a);y.splice(b,0,{response:function(a){return c(k.when(a))},
responseError:function(a){return c(k.reject(a))}})});u.pendingRequests=[];(function(a){n(arguments,function(a){u[a]=function(b,c){return u(t(c||{},{method:a,url:b}))}})})("get","delete","head","jsonp");(function(a){n(arguments,function(a){u[a]=function(b,c,d){return u(t(d||{},{method:a,url:b,data:c}))}})})("post","put");u.defaults=e;return u}]}function cd(){this.$get=["$browser","$window","$document",function(b,a,c){return dd(b,ed,b.defer,a.angular.callbacks,c[0],a.location.protocol.replace(":",""))}]}
function dd(b,a,c,d,e,g){function i(a,b){var c=e.createElement("script"),d=function(){e.body.removeChild(c);b&&b()};c.type="text/javascript";c.src=a;Z?c.onreadystatechange=function(){/loaded|complete/.test(c.readyState)&&d()}:c.onload=c.onerror=d;e.body.appendChild(c);return d}return function(e,h,j,m,k,l,u,o){function z(){p=-1;t&&t();v&&v.abort()}function r(a,d,e,f){var j=(h.match(jb)||["",g])[1];A&&c.cancel(A);t=v=null;d=j=="file"?e?200:404:d;a(d==1223?204:d,e,f);b.$$completeOutstandingRequest(q)}
var p;b.$$incOutstandingRequestCount();h=h||b.url();if(I(e)=="jsonp"){var x="_"+(d.counter++).toString(36);d[x]=function(a){d[x].data=a};var t=i(h.replace("JSON_CALLBACK","angular.callbacks."+x),function(){d[x].data?r(m,200,d[x].data):r(m,p||-2);delete d[x]})}else{var v=new a;v.open(e,h,!0);n(k,function(a,b){a&&v.setRequestHeader(b,a)});v.onreadystatechange=function(){if(v.readyState==4){var a=v.getAllResponseHeaders(),b=["Cache-Control","Content-Language","Content-Type","Expires","Last-Modified",
"Pragma"];a||(a="",n(b,function(b){var c=v.getResponseHeader(b);c&&(a+=b+": "+c+"\n")}));r(m,p||v.status,v.responseType?v.response:v.responseText,a)}};if(u)v.withCredentials=!0;if(o)v.responseType=o;v.send(j||"")}if(l>0)var A=c(z,l);else l&&l.then&&l.then(z)}}function fd(){this.$get=function(){return{id:"en-us",NUMBER_FORMATS:{DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{minInt:1,minFrac:0,maxFrac:3,posPre:"",posSuf:"",negPre:"-",negSuf:"",gSize:3,lgSize:3},{minInt:1,minFrac:2,maxFrac:2,posPre:"\u00a4",
posSuf:"",negPre:"(\u00a4",negSuf:")",gSize:3,lgSize:3}],CURRENCY_SYM:"$"},DATETIME_FORMATS:{MONTH:"January,February,March,April,May,June,July,August,September,October,November,December".split(","),SHORTMONTH:"Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),DAY:"Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),SHORTDAY:"Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","),AMPMS:["AM","PM"],medium:"MMM d, y h:mm:ss a","short":"M/d/yy h:mm a",fullDate:"EEEE, MMMM d, y",longDate:"MMMM d, y",
mediumDate:"MMM d, y",shortDate:"M/d/yy",mediumTime:"h:mm:ss a",shortTime:"h:mm a"},pluralCat:function(b){return b===1?"one":"other"}}}}function gd(){this.$get=["$rootScope","$browser","$q","$exceptionHandler",function(b,a,c,d){function e(e,f,h){var j=c.defer(),m=j.promise,k=B(h)&&!h,f=a.defer(function(){try{j.resolve(e())}catch(a){j.reject(a),d(a)}k||b.$apply()},f),h=function(){delete g[m.$$timeoutId]};m.$$timeoutId=f;g[f]=j;m.then(h,h);return m}var g={};e.cancel=function(b){return b&&b.$$timeoutId in
g?(g[b.$$timeoutId].reject("canceled"),a.defer.cancel(b.$$timeoutId)):!1};return e}]}function Zb(b){function a(a,e){return b.factory(a+c,e)}var c="Filter";this.register=a;this.$get=["$injector",function(a){return function(b){return a.get(b+c)}}];a("currency",$b);a("date",ac);a("filter",hd);a("json",id);a("limitTo",jd);a("lowercase",kd);a("number",bc);a("orderBy",cc);a("uppercase",ld)}function hd(){return function(b,a,c){if(!F(b))return b;var d=[];d.check=function(a){for(var b=0;b<d.length;b++)if(!d[b](a))return!1;
return!0};switch(typeof c){case "function":break;case "boolean":if(c==!0){c=function(a,b){return Ha.equals(a,b)};break}default:c=function(a,b){b=(""+b).toLowerCase();return(""+a).toLowerCase().indexOf(b)>-1}}var e=function(a,b){if(typeof b=="string"&&b.charAt(0)==="!")return!e(a,b.substr(1));switch(typeof a){case "boolean":case "number":case "string":return c(a,b);case "object":switch(typeof b){case "object":return c(a,b);default:for(var d in a)if(d.charAt(0)!=="$"&&e(a[d],b))return!0}return!1;case "array":for(d=
0;d<a.length;d++)if(e(a[d],b))return!0;return!1;default:return!1}};switch(typeof a){case "boolean":case "number":case "string":a={$:a};case "object":for(var g in a)g=="$"?function(){if(a[g]){var b=g;d.push(function(c){return e(c,a[b])})}}():function(){if(a[g]){var b=g;d.push(function(c){return e(ib(c,b),a[b])})}}();break;case "function":d.push(a);break;default:return b}for(var i=[],f=0;f<b.length;f++){var h=b[f];d.check(h)&&i.push(h)}return i}}function $b(b){var a=b.NUMBER_FORMATS;return function(b,
d){if(C(d))d=a.CURRENCY_SYM;return dc(b,a.PATTERNS[1],a.GROUP_SEP,a.DECIMAL_SEP,2).replace(/\u00A4/g,d)}}function bc(b){var a=b.NUMBER_FORMATS;return function(b,d){return dc(b,a.PATTERNS[0],a.GROUP_SEP,a.DECIMAL_SEP,d)}}function dc(b,a,c,d,e){if(isNaN(b)||!isFinite(b))return"";var g=b<0,b=Math.abs(b),i=b+"",f="",h=[],j=!1;if(i.indexOf("e")!==-1){var m=i.match(/([\d\.]+)e(-?)(\d+)/);m&&m[2]=="-"&&m[3]>e+1?i="0":(f=i,j=!0)}if(!j){i=(i.split(ec)[1]||"").length;C(e)&&(e=Math.min(Math.max(a.minFrac,i),
a.maxFrac));var i=Math.pow(10,e),b=Math.round(b*i)/i,b=(""+b).split(ec),i=b[0],b=b[1]||"",j=0,m=a.lgSize,k=a.gSize;if(i.length>=m+k)for(var j=i.length-m,l=0;l<j;l++)(j-l)%k===0&&l!==0&&(f+=c),f+=i.charAt(l);for(l=j;l<i.length;l++)(i.length-l)%m===0&&l!==0&&(f+=c),f+=i.charAt(l);for(;b.length<e;)b+="0";e&&e!=="0"&&(f+=d+b.substr(0,e))}h.push(g?a.negPre:a.posPre);h.push(f);h.push(g?a.negSuf:a.posSuf);return h.join("")}function nb(b,a,c){var d="";b<0&&(d="-",b=-b);for(b=""+b;b.length<a;)b="0"+b;c&&(b=
b.substr(b.length-a));return d+b}function Q(b,a,c,d){c=c||0;return function(e){e=e["get"+b]();if(c>0||e>-c)e+=c;e===0&&c==-12&&(e=12);return nb(e,a,d)}}function Qa(b,a){return function(c,d){var e=c["get"+b](),g=oa(a?"SHORT"+b:b);return d[g][e]}}function ac(b){function a(a){var b;if(b=a.match(c)){var a=new Date(0),g=0,i=0,f=b[8]?a.setUTCFullYear:a.setFullYear,h=b[8]?a.setUTCHours:a.setHours;b[9]&&(g=N(b[9]+b[10]),i=N(b[9]+b[11]));f.call(a,N(b[1]),N(b[2])-1,N(b[3]));g=N(b[4]||0)-g;i=N(b[5]||0)-i;f=
N(b[6]||0);b=Math.round(parseFloat("0."+(b[7]||0))*1E3);h.call(a,g,i,f,b)}return a}var c=/^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;return function(c,e){var g="",i=[],f,h,e=e||"mediumDate",e=b.DATETIME_FORMATS[e]||e;E(c)&&(c=md.test(c)?N(c):a(c));Ya(c)&&(c=new Date(c));if(!ra(c))return c;for(;e;)(h=nd.exec(e))?(i=i.concat(ka.call(h,1)),e=i.pop()):(i.push(e),e=null);n(i,function(a){f=od[a];g+=f?f(c,b.DATETIME_FORMATS):a.replace(/(^'|'$)/g,
"").replace(/''/g,"'")});return g}}function id(){return function(b){return ha(b,!0)}}function jd(){return function(b,a){if(!F(b)&&!E(b))return b;a=N(a);if(E(b))return a?a>=0?b.slice(0,a):b.slice(a,b.length):"";var c=[],d,e;a>b.length?a=b.length:a<-b.length&&(a=-b.length);a>0?(d=0,e=a):(d=b.length+a,e=b.length);for(;d<e;d++)c.push(b[d]);return c}}function cc(b){return function(a,c,d){function e(a,b){return ua(b)?function(b,c){return a(c,b)}:a}if(!F(a))return a;if(!c)return a;for(var c=F(c)?c:[c],c=
Za(c,function(a){var c=!1,d=a||qa;if(E(a)){if(a.charAt(0)=="+"||a.charAt(0)=="-")c=a.charAt(0)=="-",a=a.substring(1);d=b(a)}return e(function(a,b){var c;c=d(a);var e=d(b),f=typeof c,g=typeof e;f==g?(f=="string"&&(c=c.toLowerCase()),f=="string"&&(e=e.toLowerCase()),c=c===e?0:c<e?-1:1):c=f<g?-1:1;return c},c)}),g=[],i=0;i<a.length;i++)g.push(a[i]);return g.sort(e(function(a,b){for(var d=0;d<c.length;d++){var e=c[d](a,b);if(e!==0)return e}return 0},d))}}function aa(b){H(b)&&(b={link:b});b.restrict=b.restrict||
"AC";return S(b)}function fc(b,a){function c(a,c){c=c?"-"+bb(c,"-"):"";b.removeClass((a?Ra:Sa)+c).addClass((a?Sa:Ra)+c)}var d=this,e=b.parent().controller("form")||Ta,g=0,i=d.$error={},f=[];d.$name=a.name;d.$dirty=!1;d.$pristine=!0;d.$valid=!0;d.$invalid=!1;e.$addControl(d);b.addClass(pa);c(!0);d.$addControl=function(a){f.push(a);a.$name&&!d.hasOwnProperty(a.$name)&&(d[a.$name]=a)};d.$removeControl=function(a){a.$name&&d[a.$name]===a&&delete d[a.$name];n(i,function(b,c){d.$setValidity(c,!0,a)});ta(f,
a)};d.$setValidity=function(a,b,f){var k=i[a];if(b){if(k&&(ta(k,f),!k.length)){g--;if(!g)c(b),d.$valid=!0,d.$invalid=!1;i[a]=!1;c(!0,a);e.$setValidity(a,!0,d)}}else{g||c(b);if(k){if(Ga(k,f)!=-1)return}else i[a]=k=[],g++,c(!1,a),e.$setValidity(a,!1,d);k.push(f);d.$valid=!1;d.$invalid=!0}};d.$setDirty=function(){b.removeClass(pa).addClass(Ua);d.$dirty=!0;d.$pristine=!1;e.$setDirty()};d.$setPristine=function(){b.removeClass(Ua).addClass(pa);d.$dirty=!1;d.$pristine=!0;n(f,function(a){a.$setPristine()})}}
function X(b){return C(b)||b===""||b===null||b!==b}function Va(b,a,c,d,e,g){var i=function(){var e=a.val();if(ua(c.ngTrim||"T"))e=U(e);d.$viewValue!==e&&b.$apply(function(){d.$setViewValue(e)})};if(e.hasEvent("input"))a.bind("input",i);else{var f,h=function(){f||(f=g.defer(function(){i();f=null}))};a.bind("keydown",function(a){a=a.keyCode;a===91||15<a&&a<19||37<=a&&a<=40||h()});a.bind("change",i);e.hasEvent("paste")&&a.bind("paste cut",h)}d.$render=function(){a.val(X(d.$viewValue)?"":d.$viewValue)};
var j=c.ngPattern,m=function(a,b){return X(b)||a.test(b)?(d.$setValidity("pattern",!0),b):(d.$setValidity("pattern",!1),p)};j&&((e=j.match(/^\/(.*)\/([gim]*)$/))?(j=RegExp(e[1],e[2]),e=function(a){return m(j,a)}):e=function(a){var c=b.$eval(j);if(!c||!c.test)throw Error("Expected "+j+" to be a RegExp but was "+c);return m(c,a)},d.$formatters.push(e),d.$parsers.push(e));if(c.ngMinlength){var k=N(c.ngMinlength),e=function(a){return!X(a)&&a.length<k?(d.$setValidity("minlength",!1),p):(d.$setValidity("minlength",
!0),a)};d.$parsers.push(e);d.$formatters.push(e)}if(c.ngMaxlength){var l=N(c.ngMaxlength),e=function(a){return!X(a)&&a.length>l?(d.$setValidity("maxlength",!1),p):(d.$setValidity("maxlength",!0),a)};d.$parsers.push(e);d.$formatters.push(e)}}function ob(b,a){b="ngClass"+b;return aa(function(c,d,e){function g(b){if(a===!0||c.$index%2===a)h&&!ia(b,h)&&i(h),f(b);h=V(b)}function i(a){L(a)&&!F(a)&&(a=Za(a,function(a,b){if(a)return b}));d.removeClass(F(a)?a.join(" "):a)}function f(a){L(a)&&!F(a)&&(a=Za(a,
function(a,b){if(a)return b}));a&&d.addClass(F(a)?a.join(" "):a)}var h=p;c.$watch(e[b],g,!0);e.$observe("class",function(){var a=c.$eval(e[b]);g(a,a)});b!=="ngClass"&&c.$watch("$index",function(d,g){var h=d&1;h!==g&1&&(h===a?f(c.$eval(e[b])):i(c.$eval(e[b])))})})}var I=function(b){return E(b)?b.toLowerCase():b},oa=function(b){return E(b)?b.toUpperCase():b},Z=N((/msie (\d+)/.exec(I(navigator.userAgent))||[])[1]),w,ga,ka=[].slice,Wa=[].push,Ea=Object.prototype.toString,mc=M.angular,Ha=M.angular||(M.angular=
{}),Aa,hb,ba=["0","0","0"];q.$inject=[];qa.$inject=[];hb=Z<9?function(b){b=b.nodeName?b:b[0];return b.scopeName&&b.scopeName!="HTML"?oa(b.scopeName+":"+b.nodeName):b.nodeName}:function(b){return b.nodeName?b.nodeName:b[0].nodeName};var sc=/[A-Z]/g,pd={full:"1.1.5",major:1,minor:1,dot:5,codeName:"triangle-squarification"},Ka=R.cache={},Ja=R.expando="ng-"+(new Date).getTime(),wc=1,gc=M.document.addEventListener?function(b,a,c){b.addEventListener(a,c,!1)}:function(b,a,c){b.attachEvent("on"+a,c)},gb=
M.document.removeEventListener?function(b,a,c){b.removeEventListener(a,c,!1)}:function(b,a,c){b.detachEvent("on"+a,c)},uc=/([\:\-\_]+(.))/g,vc=/^moz([A-Z])/,Ba=R.prototype={ready:function(b){function a(){c||(c=!0,b())}var c=!1;T.readyState==="complete"?setTimeout(a):(this.bind("DOMContentLoaded",a),R(M).bind("load",a))},toString:function(){var b=[];n(this,function(a){b.push(""+a)});return"["+b.join(", ")+"]"},eq:function(b){return b>=0?w(this[b]):w(this[this.length+b])},length:0,push:Wa,sort:[].sort,
splice:[].splice},Na={};n("multiple,selected,checked,disabled,readOnly,required,open".split(","),function(b){Na[I(b)]=b});var Gb={};n("input,select,option,textarea,button,form,details".split(","),function(b){Gb[oa(b)]=!0});n({data:Bb,inheritedData:Ma,scope:function(b){return Ma(b,"$scope")},controller:Eb,injector:function(b){return Ma(b,"$injector")},removeAttr:function(b,a){b.removeAttribute(a)},hasClass:La,css:function(b,a,c){a=Ia(a);if(B(c))b.style[a]=c;else{var d;Z<=8&&(d=b.currentStyle&&b.currentStyle[a],
d===""&&(d="auto"));d=d||b.style[a];Z<=8&&(d=d===""?p:d);return d}},attr:function(b,a,c){var d=I(a);if(Na[d])if(B(c))c?(b[a]=!0,b.setAttribute(a,d)):(b[a]=!1,b.removeAttribute(d));else return b[a]||(b.attributes.getNamedItem(a)||q).specified?d:p;else if(B(c))b.setAttribute(a,c);else if(b.getAttribute)return b=b.getAttribute(a,2),b===null?p:b},prop:function(b,a,c){if(B(c))b[a]=c;else return b[a]},text:t(Z<9?function(b,a){if(b.nodeType==1){if(C(a))return b.innerText;b.innerText=a}else{if(C(a))return b.nodeValue;
b.nodeValue=a}}:function(b,a){if(C(a))return b.textContent;b.textContent=a},{$dv:""}),val:function(b,a){if(C(a))return b.value;b.value=a},html:function(b,a){if(C(a))return b.innerHTML;for(var c=0,d=b.childNodes;c<d.length;c++)ya(d[c]);b.innerHTML=a}},function(b,a){R.prototype[a]=function(a,d){var e,g;if((b.length==2&&b!==La&&b!==Eb?a:d)===p)if(L(a)){for(e=0;e<this.length;e++)if(b===Bb)b(this[e],a);else for(g in a)b(this[e],g,a[g]);return this}else{if(this.length)return b(this[0],a,d)}else{for(e=0;e<
this.length;e++)b(this[e],a,d);return this}return b.$dv}});n({removeData:zb,dealoc:ya,bind:function a(c,d,e){var g=ca(c,"events"),i=ca(c,"handle");g||ca(c,"events",g={});i||ca(c,"handle",i=xc(c,g));n(d.split(" "),function(d){var h=g[d];if(!h){if(d=="mouseenter"||d=="mouseleave"){var j=T.body.contains||T.body.compareDocumentPosition?function(a,c){var d=a.nodeType===9?a.documentElement:a,e=c&&c.parentNode;return a===e||!(!e||!(e.nodeType===1&&(d.contains?d.contains(e):a.compareDocumentPosition&&a.compareDocumentPosition(e)&
16)))}:function(a,c){if(c)for(;c=c.parentNode;)if(c===a)return!0;return!1};g[d]=[];a(c,{mouseleave:"mouseout",mouseenter:"mouseover"}[d],function(a){var c=a.relatedTarget;(!c||c!==this&&!j(this,c))&&i(a,d)})}else gc(c,d,i),g[d]=[];h=g[d]}h.push(e)})},unbind:Ab,replaceWith:function(a,c){var d,e=a.parentNode;ya(a);n(new R(c),function(c){d?e.insertBefore(c,d.nextSibling):e.replaceChild(c,a);d=c})},children:function(a){var c=[];n(a.childNodes,function(a){a.nodeType===1&&c.push(a)});return c},contents:function(a){return a.childNodes||
[]},append:function(a,c){n(new R(c),function(c){(a.nodeType===1||a.nodeType===11)&&a.appendChild(c)})},prepend:function(a,c){if(a.nodeType===1){var d=a.firstChild;n(new R(c),function(c){d?a.insertBefore(c,d):(a.appendChild(c),d=c)})}},wrap:function(a,c){var c=w(c)[0],d=a.parentNode;d&&d.replaceChild(c,a);c.appendChild(a)},remove:function(a){ya(a);var c=a.parentNode;c&&c.removeChild(a)},after:function(a,c){var d=a,e=a.parentNode;n(new R(c),function(a){e.insertBefore(a,d.nextSibling);d=a})},addClass:Db,
removeClass:Cb,toggleClass:function(a,c,d){C(d)&&(d=!La(a,c));(d?Db:Cb)(a,c)},parent:function(a){return(a=a.parentNode)&&a.nodeType!==11?a:null},next:function(a){if(a.nextElementSibling)return a.nextElementSibling;for(a=a.nextSibling;a!=null&&a.nodeType!==1;)a=a.nextSibling;return a},find:function(a,c){return a.getElementsByTagName(c)},clone:fb,triggerHandler:function(a,c){var d=(ca(a,"events")||{})[c];n(d,function(c){c.call(a,{preventDefault:q})})}},function(a,c){R.prototype[c]=function(c,e){for(var g,
i=0;i<this.length;i++)g==p?(g=a(this[i],c,e),g!==p&&(g=w(g))):eb(g,a(this[i],c,e));return g==p?this:g}});za.prototype={put:function(a,c){this[la(a)]=c},get:function(a){return this[la(a)]},remove:function(a){var c=this[a=la(a)];delete this[a];return c}};var zc=/^function\s*[^\(]*\(\s*([^\)]*)\)/m,Ac=/,/,Bc=/^\s*(_?)(\S+?)\1\s*$/,yc=/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;Ib.$inject=["$provide"];var qd=function(){var a="$ngAnimateController",c={running:!0};this.$get=["$animation","$window","$sniffer","$rootElement",
"$rootScope",function(d,e,g,i){i.data(a,c);i=function(c,i){function j(j,k,o){return function(m,r,p){function x(a){var c=0,a=E(a)?a.split(/\s*,\s*/):[];n(a,function(a){c=Math.max(parseFloat(a)||0,c)});return c}function t(){m.addClass(K);if($)$(m,v,P);else if(H(e.getComputedStyle)){var a=g.vendorPrefix+"Animation",c=g.vendorPrefix+"Transition",d=0;n(m,function(f){if(f.nodeType==1){var g="transition",i=c,j=1,h=e.getComputedStyle(f)||{};if(parseFloat(h.animationDuration)>0||parseFloat(h[a+"Duration"])>
0)g="animation",i=a,j=Math.max(parseInt(h[g+"IterationCount"])||0,parseInt(h[i+"IterationCount"])||0,j);f=Math.max(x(h[g+"Delay"]),x(h[i+"Delay"]));g=Math.max(x(h[g+"Duration"]),x(h[i+"Duration"]));d=Math.max(f+j*g,d)}});e.setTimeout(v,d*1E3)}else v()}function v(){if(!v.run)v.run=!0,o(m,r,p),m.removeClass(w),m.removeClass(K),m.removeData(a)}var A=c.$eval(i.ngAnimate),w=A?L(A)?A[j]:A+"-"+j:"",D=d(w),A=D&&D.setup,$=D&&D.start,D=D&&D.cancel;if(w){var K=w+"-active";r||(r=p?p.parent():m.parent());if(!g.transitions&&
!A&&!$||(r.inheritedData(a)||q).running)k(m,r,p),o(m,r,p);else{var O=m.data(a)||{};O.running&&((D||q)(m),O.done());m.data(a,{running:!0,done:v});m.addClass(w);k(m,r,p);if(m.length==0)return v();var P=(A||q)(m);e.setTimeout(t,1)}}else k(m,r,p),o(m,r,p)}}function m(a,c,d){d?d.after(a):c.append(a)}var k={};k.enter=j("enter",m,q);k.leave=j("leave",q,function(a){a.remove()});k.move=j("move",function(a,c,d){m(a,c,d)},q);k.show=j("show",function(a){a.css("display","")},q);k.hide=j("hide",q,function(a){a.css("display",
"none")});k.animate=function(a,c){j(a,q,q)(c)};return k};i.enabled=function(a){if(arguments.length)c.running=!a;return!c.running};return i}]},Kb="Non-assignable model expression: ";Jb.$inject=["$provide"];var Ic=/^(x[\:\-_]|data[\:\-_])/i,jb=/^([^:]+):\/\/(\w+:{0,1}\w*@)?(\{?[\w\.-]*\}?)(:([0-9]+))?(\/[^\?#]*)?(\?([^#]*))?(#(.*))?$/,Pb=/^([^\?#]*)(\?([^#]*))?(#(.*))?$/,Oa={http:80,https:443,ftp:21};Rb.prototype=lb.prototype=Qb.prototype={$$replace:!1,absUrl:Pa("$$absUrl"),url:function(a,c){if(C(a))return this.$$url;
var d=Pb.exec(a);d[1]&&this.path(decodeURIComponent(d[1]));if(d[2]||d[1])this.search(d[3]||"");this.hash(d[5]||"",c);return this},protocol:Pa("$$protocol"),host:Pa("$$host"),port:Pa("$$port"),path:Sb("$$path",function(a){return a.charAt(0)=="/"?a:"/"+a}),search:function(a,c){if(C(a))return this.$$search;B(c)?c===null?delete this.$$search[a]:this.$$search[a]=c:this.$$search=E(a)?vb(a):a;this.$$compose();return this},hash:Sb("$$hash",qa),replace:function(){this.$$replace=!0;return this}};var Da={"null":function(){return null},
"true":function(){return!0},"false":function(){return!1},undefined:q,"+":function(a,c,d,e){d=d(a,c);e=e(a,c);return B(d)?B(e)?d+e:d:B(e)?e:p},"-":function(a,c,d,e){d=d(a,c);e=e(a,c);return(B(d)?d:0)-(B(e)?e:0)},"*":function(a,c,d,e){return d(a,c)*e(a,c)},"/":function(a,c,d,e){return d(a,c)/e(a,c)},"%":function(a,c,d,e){return d(a,c)%e(a,c)},"^":function(a,c,d,e){return d(a,c)^e(a,c)},"=":q,"===":function(a,c,d,e){return d(a,c)===e(a,c)},"!==":function(a,c,d,e){return d(a,c)!==e(a,c)},"==":function(a,
c,d,e){return d(a,c)==e(a,c)},"!=":function(a,c,d,e){return d(a,c)!=e(a,c)},"<":function(a,c,d,e){return d(a,c)<e(a,c)},">":function(a,c,d,e){return d(a,c)>e(a,c)},"<=":function(a,c,d,e){return d(a,c)<=e(a,c)},">=":function(a,c,d,e){return d(a,c)>=e(a,c)},"&&":function(a,c,d,e){return d(a,c)&&e(a,c)},"||":function(a,c,d,e){return d(a,c)||e(a,c)},"&":function(a,c,d,e){return d(a,c)&e(a,c)},"|":function(a,c,d,e){return e(a,c)(a,c,d(a,c))},"!":function(a,c,d){return!d(a,c)}},Qc={n:"\n",f:"\u000c",r:"\r",
t:"\t",v:"\u000b","'":"'",'"':'"'},mb={},ad=/^(([^:]+):)?\/\/(\w+:{0,1}\w*@)?([\w\.-]*)?(:([0-9]+))?(.*)$/,ed=M.XMLHttpRequest||function(){try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(a){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(c){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(d){}throw Error("This browser does not support XMLHttpRequest.");};Zb.$inject=["$provide"];$b.$inject=["$locale"];bc.$inject=["$locale"];var ec=".",od={yyyy:Q("FullYear",4),yy:Q("FullYear",
2,0,!0),y:Q("FullYear",1),MMMM:Qa("Month"),MMM:Qa("Month",!0),MM:Q("Month",2,1),M:Q("Month",1,1),dd:Q("Date",2),d:Q("Date",1),HH:Q("Hours",2),H:Q("Hours",1),hh:Q("Hours",2,-12),h:Q("Hours",1,-12),mm:Q("Minutes",2),m:Q("Minutes",1),ss:Q("Seconds",2),s:Q("Seconds",1),sss:Q("Milliseconds",3),EEEE:Qa("Day"),EEE:Qa("Day",!0),a:function(a,c){return a.getHours()<12?c.AMPMS[0]:c.AMPMS[1]},Z:function(a){var a=-1*a.getTimezoneOffset(),c=a>=0?"+":"";c+=nb(Math[a>0?"floor":"ceil"](a/60),2)+nb(Math.abs(a%60),
2);return c}},nd=/((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,md=/^\d+$/;ac.$inject=["$locale"];var kd=S(I),ld=S(oa);cc.$inject=["$parse"];var rd=S({restrict:"E",compile:function(a,c){Z<=8&&(!c.href&&!c.name&&c.$set("href",""),a.append(T.createComment("IE fix")));return function(a,c){c.bind("click",function(a){c.attr("href")||a.preventDefault()})}}}),pb={};n(Na,function(a,c){var d=da("ng-"+c);pb[d]=function(){return{priority:100,compile:function(){return function(a,
g,i){a.$watch(i[d],function(a){i.$set(c,!!a)})}}}}});n(["src","srcset","href"],function(a){var c=da("ng-"+a);pb[c]=function(){return{priority:99,link:function(d,e,g){g.$observe(c,function(c){c&&(g.$set(a,c),Z&&e.prop(a,g[a]))})}}}});var Ta={$addControl:q,$removeControl:q,$setValidity:q,$setDirty:q,$setPristine:q};fc.$inject=["$element","$attrs","$scope"];var Wa=function(a){return["$timeout",function(c){var d={name:"form",restrict:"E",controller:fc,compile:function(){return{pre:function(a,d,i,f){if(!i.action){var h=
function(a){a.preventDefault?a.preventDefault():a.returnValue=!1};gc(d[0],"submit",h);d.bind("$destroy",function(){c(function(){gb(d[0],"submit",h)},0,!1)})}var j=d.parent().controller("form"),m=i.name||i.ngForm;m&&(a[m]=f);j&&d.bind("$destroy",function(){j.$removeControl(f);m&&(a[m]=p);t(f,Ta)})}}}};return a?t(V(d),{restrict:"EAC"}):d}]},sd=Wa(),td=Wa(!0),ud=/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,vd=/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
wd=/^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,hc={text:Va,number:function(a,c,d,e,g,i){Va(a,c,d,e,g,i);e.$parsers.push(function(a){var c=X(a);return c||wd.test(a)?(e.$setValidity("number",!0),a===""?null:c?a:parseFloat(a)):(e.$setValidity("number",!1),p)});e.$formatters.push(function(a){return X(a)?"":""+a});if(d.min){var f=parseFloat(d.min),a=function(a){return!X(a)&&a<f?(e.$setValidity("min",!1),p):(e.$setValidity("min",!0),a)};e.$parsers.push(a);e.$formatters.push(a)}if(d.max){var h=parseFloat(d.max),
d=function(a){return!X(a)&&a>h?(e.$setValidity("max",!1),p):(e.$setValidity("max",!0),a)};e.$parsers.push(d);e.$formatters.push(d)}e.$formatters.push(function(a){return X(a)||Ya(a)?(e.$setValidity("number",!0),a):(e.$setValidity("number",!1),p)})},url:function(a,c,d,e,g,i){Va(a,c,d,e,g,i);a=function(a){return X(a)||ud.test(a)?(e.$setValidity("url",!0),a):(e.$setValidity("url",!1),p)};e.$formatters.push(a);e.$parsers.push(a)},email:function(a,c,d,e,g,i){Va(a,c,d,e,g,i);a=function(a){return X(a)||vd.test(a)?
(e.$setValidity("email",!0),a):(e.$setValidity("email",!1),p)};e.$formatters.push(a);e.$parsers.push(a)},radio:function(a,c,d,e){C(d.name)&&c.attr("name",Fa());c.bind("click",function(){c[0].checked&&a.$apply(function(){e.$setViewValue(d.value)})});e.$render=function(){c[0].checked=d.value==e.$viewValue};d.$observe("value",e.$render)},checkbox:function(a,c,d,e){var g=d.ngTrueValue,i=d.ngFalseValue;E(g)||(g=!0);E(i)||(i=!1);c.bind("click",function(){a.$apply(function(){e.$setViewValue(c[0].checked)})});
e.$render=function(){c[0].checked=e.$viewValue};e.$formatters.push(function(a){return a===g});e.$parsers.push(function(a){return a?g:i})},hidden:q,button:q,submit:q,reset:q},ic=["$browser","$sniffer",function(a,c){return{restrict:"E",require:"?ngModel",link:function(d,e,g,i){i&&(hc[I(g.type)]||hc.text)(d,e,g,i,c,a)}}}],Sa="ng-valid",Ra="ng-invalid",pa="ng-pristine",Ua="ng-dirty",xd=["$scope","$exceptionHandler","$attrs","$element","$parse",function(a,c,d,e,g){function i(a,c){c=c?"-"+bb(c,"-"):"";
e.removeClass((a?Ra:Sa)+c).addClass((a?Sa:Ra)+c)}this.$modelValue=this.$viewValue=Number.NaN;this.$parsers=[];this.$formatters=[];this.$viewChangeListeners=[];this.$pristine=!0;this.$dirty=!1;this.$valid=!0;this.$invalid=!1;this.$name=d.name;var f=g(d.ngModel),h=f.assign;if(!h)throw Error(Kb+d.ngModel+" ("+va(e)+")");this.$render=q;var j=e.inheritedData("$formController")||Ta,m=0,k=this.$error={};e.addClass(pa);i(!0);this.$setValidity=function(a,c){if(k[a]!==!c){if(c){if(k[a]&&m--,!m)i(!0),this.$valid=
!0,this.$invalid=!1}else i(!1),this.$invalid=!0,this.$valid=!1,m++;k[a]=!c;i(c,a);j.$setValidity(a,c,this)}};this.$setPristine=function(){this.$dirty=!1;this.$pristine=!0;e.removeClass(Ua).addClass(pa)};this.$setViewValue=function(d){this.$viewValue=d;if(this.$pristine)this.$dirty=!0,this.$pristine=!1,e.removeClass(pa).addClass(Ua),j.$setDirty();n(this.$parsers,function(a){d=a(d)});if(this.$modelValue!==d)this.$modelValue=d,h(a,d),n(this.$viewChangeListeners,function(a){try{a()}catch(d){c(d)}})};
var l=this;a.$watch(function(){var c=f(a);if(l.$modelValue!==c){var d=l.$formatters,e=d.length;for(l.$modelValue=c;e--;)c=d[e](c);if(l.$viewValue!==c)l.$viewValue=c,l.$render()}})}],yd=function(){return{require:["ngModel","^?form"],controller:xd,link:function(a,c,d,e){var g=e[0],i=e[1]||Ta;i.$addControl(g);c.bind("$destroy",function(){i.$removeControl(g)})}}},zd=S({require:"ngModel",link:function(a,c,d,e){e.$viewChangeListeners.push(function(){a.$eval(d.ngChange)})}}),jc=function(){return{require:"?ngModel",
link:function(a,c,d,e){if(e){d.required=!0;var g=function(a){if(d.required&&(X(a)||a===!1))e.$setValidity("required",!1);else return e.$setValidity("required",!0),a};e.$formatters.push(g);e.$parsers.unshift(g);d.$observe("required",function(){g(e.$viewValue)})}}}},Ad=function(){return{require:"ngModel",link:function(a,c,d,e){var g=(a=/\/(.*)\//.exec(d.ngList))&&RegExp(a[1])||d.ngList||",";e.$parsers.push(function(a){var c=[];a&&n(a.split(g),function(a){a&&c.push(U(a))});return c});e.$formatters.push(function(a){return F(a)?
a.join(", "):p})}}},Bd=/^(true|false|\d+)$/,Cd=function(){return{priority:100,compile:function(a,c){return Bd.test(c.ngValue)?function(a,c,g){g.$set("value",a.$eval(g.ngValue))}:function(a,c,g){a.$watch(g.ngValue,function(a){g.$set("value",a,!1)})}}}},Dd=aa(function(a,c,d){c.addClass("ng-binding").data("$binding",d.ngBind);a.$watch(d.ngBind,function(a){c.text(a==p?"":a)})}),Ed=["$interpolate",function(a){return function(c,d,e){c=a(d.attr(e.$attr.ngBindTemplate));d.addClass("ng-binding").data("$binding",
c);e.$observe("ngBindTemplate",function(a){d.text(a)})}}],Fd=[function(){return function(a,c,d){c.addClass("ng-binding").data("$binding",d.ngBindHtmlUnsafe);a.$watch(d.ngBindHtmlUnsafe,function(a){c.html(a||"")})}}],Gd=ob("",!0),Hd=ob("Odd",0),Id=ob("Even",1),Jd=aa({compile:function(a,c){c.$set("ngCloak",p);a.removeClass("ng-cloak")}}),Kd=[function(){return{scope:!0,controller:"@"}}],Ld=["$sniffer",function(a){return{priority:1E3,compile:function(){a.csp=!0}}}],kc={};n("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress".split(" "),
function(a){var c=da("ng-"+a);kc[c]=["$parse",function(d){return function(e,g,i){var f=d(i[c]);g.bind(I(a),function(a){e.$apply(function(){f(e,{$event:a})})})}}]});var Md=aa(function(a,c,d){c.bind("submit",function(){a.$apply(d.ngSubmit)})}),Nd=["$animator",function(a){return{transclude:"element",priority:1E3,terminal:!0,restrict:"A",compile:function(c,d,e){return function(c,d,f){var h=a(c,f),j,m;c.$watch(f.ngIf,function(a){j&&(h.leave(j),j=p);m&&(m.$destroy(),m=p);ua(a)&&(m=c.$new(),e(m,function(a){j=
a;h.enter(a,d.parent(),d)}))})}}}}],Od=["$http","$templateCache","$anchorScroll","$compile","$animator",function(a,c,d,e,g){return{restrict:"ECA",terminal:!0,compile:function(i,f){var h=f.ngInclude||f.src,j=f.onload||"",m=f.autoscroll;return function(f,i,n){var o=g(f,n),p=0,r,t=function(){r&&(r.$destroy(),r=null);o.leave(i.contents(),i)};f.$watch(h,function(g){var h=++p;g?(a.get(g,{cache:c}).success(function(a){h===p&&(r&&r.$destroy(),r=f.$new(),o.leave(i.contents(),i),a=w("<div/>").html(a).contents(),
o.enter(a,i),e(a)(r),B(m)&&(!m||f.$eval(m))&&d(),r.$emit("$includeContentLoaded"),f.$eval(j))}).error(function(){h===p&&t()}),f.$emit("$includeContentRequested")):t()})}}}}],Pd=aa({compile:function(){return{pre:function(a,c,d){a.$eval(d.ngInit)}}}}),Qd=aa({terminal:!0,priority:1E3}),Rd=["$locale","$interpolate",function(a,c){var d=/{}/g;return{restrict:"EA",link:function(e,g,i){var f=i.count,h=g.attr(i.$attr.when),j=i.offset||0,m=e.$eval(h),k={},l=c.startSymbol(),p=c.endSymbol();n(m,function(a,e){k[e]=
c(a.replace(d,l+f+"-"+j+p))});e.$watch(function(){var c=parseFloat(e.$eval(f));return isNaN(c)?"":(c in m||(c=a.pluralCat(c-j)),k[c](e,g,!0))},function(a){g.text(a)})}}}],Sd=["$parse","$animator",function(a,c){return{transclude:"element",priority:1E3,terminal:!0,compile:function(d,e,g){return function(d,e,h){var j=c(d,h),m=h.ngRepeat,k=m.match(/^\s*(.+)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/),l,p,o,z,r,t={$id:la};if(!k)throw Error("Expected ngRepeat in form of '_item_ in _collection_[ track by _id_]' but got '"+
m+"'.");h=k[1];o=k[2];(k=k[4])?(l=a(k),p=function(a,c,e){r&&(t[r]=a);t[z]=c;t.$index=e;return l(d,t)}):p=function(a,c){return la(c)};k=h.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);if(!k)throw Error("'item' in 'item in collection' should be identifier or (key, value) but got '"+h+"'.");z=k[3]||k[1];r=k[2];var x={};d.$watchCollection(o,function(a){var c,h,k=e,l,o={},t,q,w,s,B,y,C=[];if(Xa(a))B=a;else{B=[];for(w in a)a.hasOwnProperty(w)&&w.charAt(0)!="$"&&B.push(w);B.sort()}t=B.length;h=
C.length=B.length;for(c=0;c<h;c++)if(w=a===B?c:B[c],s=a[w],l=p(w,s,c),x.hasOwnProperty(l))y=x[l],delete x[l],o[l]=y,C[c]=y;else if(o.hasOwnProperty(l))throw n(C,function(a){a&&a.element&&(x[a.id]=a)}),Error("Duplicates in a repeater are not allowed. Repeater: "+m+" key: "+l);else C[c]={id:l},o[l]=!1;for(w in x)if(x.hasOwnProperty(w))y=x[w],j.leave(y.element),y.element[0].$$NG_REMOVED=!0,y.scope.$destroy();c=0;for(h=B.length;c<h;c++){w=a===B?c:B[c];s=a[w];y=C[c];if(y.element){q=y.scope;l=k[0];do l=
l.nextSibling;while(l&&l.$$NG_REMOVED);y.element[0]!=l&&j.move(y.element,null,k);k=y.element}else q=d.$new();q[z]=s;r&&(q[r]=w);q.$index=c;q.$first=c===0;q.$last=c===t-1;q.$middle=!(q.$first||q.$last);y.element||g(q,function(a){j.enter(a,null,k);k=a;y.scope=q;y.element=a;o[y.id]=y})}x=o})}}}}],Td=["$animator",function(a){return function(c,d,e){var g=a(c,e);c.$watch(e.ngShow,function(a){g[ua(a)?"show":"hide"](d)})}}],Ud=["$animator",function(a){return function(c,d,e){var g=a(c,e);c.$watch(e.ngHide,
function(a){g[ua(a)?"hide":"show"](d)})}}],Vd=aa(function(a,c,d){a.$watch(d.ngStyle,function(a,d){d&&a!==d&&n(d,function(a,d){c.css(d,"")});a&&c.css(a)},!0)}),Wd=["$animator",function(a){return{restrict:"EA",require:"ngSwitch",controller:["$scope",function(){this.cases={}}],link:function(c,d,e,g){var i=a(c,e),f,h,j=[];c.$watch(e.ngSwitch||e.on,function(a){for(var d=0,l=j.length;d<l;d++)j[d].$destroy(),i.leave(h[d]);h=[];j=[];if(f=g.cases["!"+a]||g.cases["?"])c.$eval(e.change),n(f,function(a){var d=
c.$new();j.push(d);a.transclude(d,function(c){var d=a.element;h.push(c);i.enter(c,d.parent(),d)})})})}}}],Xd=aa({transclude:"element",priority:500,require:"^ngSwitch",compile:function(a,c,d){return function(a,g,i,f){f.cases["!"+c.ngSwitchWhen]=f.cases["!"+c.ngSwitchWhen]||[];f.cases["!"+c.ngSwitchWhen].push({transclude:d,element:g})}}}),Yd=aa({transclude:"element",priority:500,require:"^ngSwitch",compile:function(a,c,d){return function(a,c,i,f){f.cases["?"]=f.cases["?"]||[];f.cases["?"].push({transclude:d,
element:c})}}}),Zd=aa({controller:["$transclude","$element",function(a,c){a(function(a){c.append(a)})}]}),$d=["$http","$templateCache","$route","$anchorScroll","$compile","$controller","$animator",function(a,c,d,e,g,i,f){return{restrict:"ECA",terminal:!0,link:function(a,c,m){function k(){var f=d.current&&d.current.locals,k=f&&f.$template;if(k){o.leave(c.contents(),c);l&&(l.$destroy(),l=null);k=w("<div></div>").html(k).contents();o.enter(k,c);var k=g(k),m=d.current;l=m.scope=a.$new();if(m.controller)f.$scope=
l,f=i(m.controller,f),m.controllerAs&&(l[m.controllerAs]=f),c.children().data("$ngControllerController",f);k(l);l.$emit("$viewContentLoaded");l.$eval(n);e()}else o.leave(c.contents(),c),l&&(l.$destroy(),l=null)}var l,n=m.onload||"",o=f(a,m);a.$on("$routeChangeSuccess",k);k()}}}],ae=["$templateCache",function(a){return{restrict:"E",terminal:!0,compile:function(c,d){d.type=="text/ng-template"&&a.put(d.id,c[0].text)}}}],be=S({terminal:!0}),ce=["$compile","$parse",function(a,c){var d=/^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w\d]*)|(?:\(\s*([\$\w][\$\w\d]*)\s*,\s*([\$\w][\$\w\d]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/,
e={$setViewValue:q};return{restrict:"E",require:["select","?ngModel"],controller:["$element","$scope","$attrs",function(a,c,d){var h=this,j={},m=e,k;h.databound=d.ngModel;h.init=function(a,c,d){m=a;k=d};h.addOption=function(c){j[c]=!0;m.$viewValue==c&&(a.val(c),k.parent()&&k.remove())};h.removeOption=function(a){this.hasOption(a)&&(delete j[a],m.$viewValue==a&&this.renderUnknownOption(a))};h.renderUnknownOption=function(c){c="? "+la(c)+" ?";k.val(c);a.prepend(k);a.val(c);k.prop("selected",!0)};h.hasOption=
function(a){return j.hasOwnProperty(a)};c.$on("$destroy",function(){h.renderUnknownOption=q})}],link:function(e,i,f,h){function j(a,c,d,e){d.$render=function(){var a=d.$viewValue;e.hasOption(a)?(v.parent()&&v.remove(),c.val(a),a===""&&t.prop("selected",!0)):C(a)&&t?c.val(""):e.renderUnknownOption(a)};c.bind("change",function(){a.$apply(function(){v.parent()&&v.remove();d.$setViewValue(c.val())})})}function m(a,c,d){var e;d.$render=function(){var a=new za(d.$viewValue);n(c.find("option"),function(c){c.selected=
B(a.get(c.value))})};a.$watch(function(){ia(e,d.$viewValue)||(e=V(d.$viewValue),d.$render())});c.bind("change",function(){a.$apply(function(){var a=[];n(c.find("option"),function(c){c.selected&&a.push(c.value)});d.$setViewValue(a)})})}function k(e,f,g){function i(){var a={"":[]},c=[""],d,h,q,v,s;q=g.$modelValue;v=u(e)||[];var z=l?qb(v):v,B,y,A;y={};s=!1;var C,D;if(o)if(t&&F(q)){s=new za([]);for(h=0;h<q.length;h++)y[k]=q[h],s.put(t(e,y),q[h])}else s=new za(q);for(A=0;B=z.length,A<B;A++){y[k]=v[l?y[l]=
z[A]:A];d=m(e,y)||"";if(!(h=a[d]))h=a[d]=[],c.push(d);o?d=s.remove(t?t(e,y):n(e,y))!=p:(t?(d={},d[k]=q,d=t(e,d)===t(e,y)):d=q===n(e,y),s=s||d);C=j(e,y);C=C===p?"":C;h.push({id:t?t(e,y):l?z[A]:A,label:C,selected:d})}o||(r||q===null?a[""].unshift({id:"",label:"",selected:!s}):s||a[""].unshift({id:"?",label:"",selected:!0}));y=0;for(z=c.length;y<z;y++){d=c[y];h=a[d];if(w.length<=y)q={element:E.clone().attr("label",d),label:h.label},v=[q],w.push(v),f.append(q.element);else if(v=w[y],q=v[0],q.label!=d)q.element.attr("label",
q.label=d);C=null;A=0;for(B=h.length;A<B;A++)if(d=h[A],s=v[A+1]){C=s.element;if(s.label!==d.label)C.text(s.label=d.label);if(s.id!==d.id)C.val(s.id=d.id);if(C[0].selected!==d.selected)C.prop("selected",s.selected=d.selected)}else d.id===""&&r?D=r:(D=x.clone()).val(d.id).attr("selected",d.selected).text(d.label),v.push({element:D,label:d.label,id:d.id,selected:d.selected}),C?C.after(D):q.element.append(D),C=D;for(A++;v.length>A;)v.pop().element.remove()}for(;w.length>y;)w.pop()[0].element.remove()}
var h;if(!(h=q.match(d)))throw Error("Expected ngOptions in form of '_select_ (as _label_)? for (_key_,)?_value_ in _collection_ (track by _expr_)?' but got '"+q+"'.");var j=c(h[2]||h[1]),k=h[4]||h[6],l=h[5],m=c(h[3]||""),n=c(h[2]?h[1]:k),u=c(h[7]),t=h[8]?c(h[8]):null,w=[[{element:f,label:""}]];r&&(a(r)(e),r.removeClass("ng-scope"),r.remove());f.html("");f.bind("change",function(){e.$apply(function(){var a,c=u(e)||[],d={},h,i,j,m,q,r;if(o){i=[];m=0;for(r=w.length;m<r;m++){a=w[m];j=1;for(q=a.length;j<
q;j++)if((h=a[j].element)[0].selected){h=h.val();l&&(d[l]=h);if(t)for(var s=0;s<c.length;s++){if(d[k]=c[s],t(e,d)==h)break}else d[k]=c[h];i.push(n(e,d))}}}else if(h=f.val(),h=="?")i=p;else if(h=="")i=null;else if(t)for(s=0;s<c.length;s++){if(d[k]=c[s],t(e,d)==h){i=n(e,d);break}}else d[k]=c[h],l&&(d[l]=h),i=n(e,d);g.$setViewValue(i)})});g.$render=i;e.$watch(i)}if(h[1]){for(var l=h[0],u=h[1],o=f.multiple,q=f.ngOptions,r=!1,t,x=w(T.createElement("option")),E=w(T.createElement("optgroup")),v=x.clone(),
h=0,A=i.children(),G=A.length;h<G;h++)if(A[h].value==""){t=r=A.eq(h);break}l.init(u,r,v);if(o&&(f.required||f.ngRequired)){var D=function(a){u.$setValidity("required",!f.required||a&&a.length);return a};u.$parsers.push(D);u.$formatters.unshift(D);f.$observe("required",function(){D(u.$viewValue)})}q?k(e,i,u):o?m(e,i,u):j(e,i,u,l)}}}}],de=["$interpolate",function(a){var c={addOption:q,removeOption:q};return{restrict:"E",priority:100,compile:function(d,e){if(C(e.value)){var g=a(d.text(),!0);g||e.$set("value",
d.text())}return function(a,d,e){var j=d.parent(),m=j.data("$selectController")||j.parent().data("$selectController");m&&m.databound?d.prop("selected",!1):m=c;g?a.$watch(g,function(a,c){e.$set("value",a);a!==c&&m.removeOption(c);m.addOption(a)}):m.addOption(e.value);d.bind("$destroy",function(){m.removeOption(e.value)})}}}}],ee=S({restrict:"E",terminal:!0});(ga=M.jQuery)?(w=ga,t(ga.fn,{scope:Ba.scope,controller:Ba.controller,injector:Ba.injector,inheritedData:Ba.inheritedData}),db("remove",!0),db("empty"),
db("html")):w=R;Ha.element=w;(function(a){t(a,{bootstrap:xb,copy:V,extend:t,equals:ia,element:w,forEach:n,injector:yb,noop:q,bind:$a,toJson:ha,fromJson:ub,identity:qa,isUndefined:C,isDefined:B,isString:E,isFunction:H,isObject:L,isNumber:Ya,isElement:oc,isArray:F,version:pd,isDate:ra,lowercase:I,uppercase:oa,callbacks:{counter:0},noConflict:lc});Aa=tc(M);try{Aa("ngLocale")}catch(c){Aa("ngLocale",[]).provider("$locale",fd)}Aa("ng",["ngLocale"],["$provide",function(a){a.provider("$compile",Jb).directive({a:rd,
input:ic,textarea:ic,form:sd,script:ae,select:ce,style:ee,option:de,ngBind:Dd,ngBindHtmlUnsafe:Fd,ngBindTemplate:Ed,ngClass:Gd,ngClassEven:Id,ngClassOdd:Hd,ngCsp:Ld,ngCloak:Jd,ngController:Kd,ngForm:td,ngHide:Ud,ngIf:Nd,ngInclude:Od,ngInit:Pd,ngNonBindable:Qd,ngPluralize:Rd,ngRepeat:Sd,ngShow:Td,ngSubmit:Md,ngStyle:Vd,ngSwitch:Wd,ngSwitchWhen:Xd,ngSwitchDefault:Yd,ngOptions:be,ngView:$d,ngTransclude:Zd,ngModel:yd,ngList:Ad,ngChange:zd,required:jc,ngRequired:jc,ngValue:Cd}).directive(pb).directive(kc);
a.provider({$anchorScroll:Cc,$animation:Ib,$animator:qd,$browser:Ec,$cacheFactory:Fc,$controller:Jc,$document:Kc,$exceptionHandler:Lc,$filter:Zb,$interpolate:Mc,$http:bd,$httpBackend:cd,$location:Nc,$log:Oc,$parse:Sc,$route:Vc,$routeParams:Wc,$rootScope:Xc,$q:Tc,$sniffer:Yc,$templateCache:Gc,$timeout:gd,$window:Zc})}])})(Ha);w(T).ready(function(){rc(T,xb)})})(window,document);angular.element(document).find("head").append('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak{display:none;}ng\\:form{display:block;}</style>');

},{}],18:[function(require,module,exports){
//     Backbone.js 1.1.0

//     (c) 2010-2011 Jeremy Ashkenas, DocumentCloud Inc.
//     (c) 2011-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(){

  // Initial Setup
  // -------------

  // Save a reference to the global object (`window` in the browser, `exports`
  // on the server).
  var root = this;

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create local references to array methods we'll want to use later.
  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both the browser and the server.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = root.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '1.1.0';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
  // the `$` variable.
  Backbone.$ = root.jQuery || root.Zepto || root.ender || root.$;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = {};
        return this;
      }
      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeningTo = this._listeningTo;
      if (!listeningTo) return this;
      var remove = !name && !callback;
      if (!callback && typeof name === 'object') callback = this;
      if (obj) (listeningTo = {})[obj._listenId] = obj;
      for (var id in listeningTo) {
        obj = listeningTo[id];
        obj.off(name, callback, this);
        if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
    }
  };

  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
      var listeningTo = this._listeningTo || (this._listeningTo = {});
      var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
      listeningTo[id] = obj;
      if (!callback && typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Backbone **Models** are the basic data object in the framework --
  // frequently representing a row in a table in a database on your server.
  // A discrete chunk of data and a bunch of useful, related methods for
  // performing computations and transformations on that data.

  // Create a new model with the specified attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var attrs = attributes || {};
    options || (options = {});
    this.cid = _.uniqueId('c');
    this.attributes = {};
    if (options.collection) this.collection = options.collection;
    if (options.parse) attrs = this.parse(attrs, options) || {};
    attrs = _.defaults({}, attrs, _.result(this, 'defaults'));
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The value returned during the last failed validation.
    validationError: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function(key, val, options) {
      var attr, attrs, unset, changes, silent, changing, prev, current;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      unset           = options.unset;
      silent          = options.silent;
      changes         = [];
      changing        = this._changing;
      this._changing  = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }
      current = this.attributes, prev = this._previousAttributes;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // For each `set` attribute, update or delete the current value.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          this.changed[attr] = val;
        } else {
          delete this.changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = true;
        for (var i = 0, l = changes.length; i < l; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // You might be wondering why there's a `while` loop here. Changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the model, firing `"change"`.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overridden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        if (!model.set(model.parse(resp, options), options)) return false;
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      var attrs, method, xhr, attributes = this.attributes;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options = _.extend({validate: true}, options);

      // If we're not waiting and attributes exist, save acts as
      // `set(attr).save(null, opts)` with validation. Otherwise, check if
      // the model will be valid when the attributes, if any, are set.
      if (attrs && !options.wait) {
        if (!this.set(attrs, options)) return false;
      } else {
        if (!this._validate(attrs, options)) return false;
      }

      // Set temporary attributes if `{wait: true}`.
      if (attrs && options.wait) {
        this.attributes = _.extend({}, attributes, attrs);
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = model.parse(resp, options);
        if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
          return false;
        }
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method === 'patch') options.attrs = attrs;
      xhr = this.sync(method, this, options);

      // Restore attributes.
      if (attrs && options.wait) this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var destroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (options.wait || model.isNew()) destroy();
        if (success) success(model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      if (this.isNew()) {
        options.success();
        return false;
      }
      wrapError(this, options);

      var xhr = this.sync('delete', this, options);
      if (!options.wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return this.id == null;
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return this._validate({}, _.extend(options || {}, { validate: true }));
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
      return false;
    }

  });

  // Underscore methods that we want to implement on the Model.
  var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];

  // Mix in each Underscore method as a proxy to `Model#attributes`.
  _.each(modelMethods, function(method) {
    Model.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.attributes);
      return _[method].apply(_, args);
    };
  });

  // Backbone.Collection
  // -------------------

  // If models tend to represent a single row of data, a Backbone Collection is
  // more analagous to a table full of data ... or a small slice or page of that
  // table, or a collection of rows that belong together for a particular reason
  // -- all of the messages in this particular folder, all of the documents
  // belonging to this particular author, and so on. Collections maintain
  // indexes of their models, both in order, and for lookup by `id`.

  // Create a new **Collection**, perhaps to contain a specific type of `model`.
  // If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // Default options for `Collection#set`.
  var setOptions = {add: true, remove: true, merge: true};
  var addOptions = {add: true, remove: false};

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set.
    add: function(models, options) {
      return this.set(models, _.extend({merge: false}, options, addOptions));
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      var singular = !_.isArray(models);
      models = singular ? [models] : _.clone(models);
      options || (options = {});
      var i, l, index, model;
      for (i = 0, l = models.length; i < l; i++) {
        model = models[i] = this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byId[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model);
      }
      return singular ? models[0] : models;
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      options = _.defaults({}, options, setOptions);
      if (options.parse) models = this.parse(models, options);
      var singular = !_.isArray(models);
      models = singular ? (models ? [models] : []) : _.clone(models);
      var i, l, id, model, attrs, existing, sort;
      var at = options.at;
      var targetModel = this.model;
      var sortable = this.comparator && (at == null) && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;
      var toAdd = [], toRemove = [], modelMap = {};
      var add = options.add, merge = options.merge, remove = options.remove;
      var order = !sortable && add && remove ? [] : false;

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      for (i = 0, l = models.length; i < l; i++) {
        attrs = models[i];
        if (attrs instanceof Model) {
          id = model = attrs;
        } else {
          id = attrs[targetModel.prototype.idAttribute];
        }

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        if (existing = this.get(id)) {
          if (remove) modelMap[existing.cid] = true;
          if (merge) {
            attrs = attrs === model ? model.attributes : attrs;
            if (options.parse) attrs = existing.parse(attrs, options);
            existing.set(attrs, options);
            if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
          }
          models[i] = existing;

        // If this is a new, valid model, push it to the `toAdd` list.
        } else if (add) {
          model = models[i] = this._prepareModel(attrs, options);
          if (!model) continue;
          toAdd.push(model);

          // Listen to added models' events, and index models for lookup by
          // `id` and by `cid`.
          model.on('all', this._onModelEvent, this);
          this._byId[model.cid] = model;
          if (model.id != null) this._byId[model.id] = model;
        }
        if (order) order.push(existing || model);
      }

      // Remove nonexistent models if appropriate.
      if (remove) {
        for (i = 0, l = this.length; i < l; ++i) {
          if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
        }
        if (toRemove.length) this.remove(toRemove, options);
      }

      // See if sorting is needed, update `length` and splice in new models.
      if (toAdd.length || (order && order.length)) {
        if (sortable) sort = true;
        this.length += toAdd.length;
        if (at != null) {
          for (i = 0, l = toAdd.length; i < l; i++) {
            this.models.splice(at + i, 0, toAdd[i]);
          }
        } else {
          if (order) this.models.length = 0;
          var orderedModels = order || toAdd;
          for (i = 0, l = orderedModels.length; i < l; i++) {
            this.models.push(orderedModels[i]);
          }
        }
      }

      // Silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      // Unless silenced, it's time to fire all appropriate add/sort events.
      if (!options.silent) {
        for (i = 0, l = toAdd.length; i < l; i++) {
          (model = toAdd[i]).trigger('add', model, this, options);
        }
        if (sort || (order && order.length)) this.trigger('sort', this, options);
      }
      
      // Return the added (or merged) model (or models).
      return singular ? models[0] : models;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function(models, options) {
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i]);
      }
      options.previousModels = this.models;
      this._reset();
      models = this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return models;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      return this.add(model, _.extend({at: this.length}, options));
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      return this.add(model, _.extend({at: 0}, options));
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Slice out a sub-array of models from the collection.
    slice: function() {
      return slice.apply(this.models, arguments);
    },

    // Get a model from the set by id.
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byId[obj.id] || this._byId[obj.cid] || this._byId[obj];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      if (_.isEmpty(attrs)) return first ? void 0 : [];
      return this[first ? 'find' : 'filter'](function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      // Run sort based on type of `comparator`.
      if (_.isString(this.comparator) || this.comparator.length === 1) {
        this.models = this.sortBy(this.comparator, this);
      } else {
        this.models.sort(_.bind(this.comparator, this));
      }

      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.invoke(this.models, 'get', attr);
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success(collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      if (!(model = this._prepareModel(model, options))) return false;
      if (!options.wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(model, resp, options) {
        if (options.wait) collection.add(model, options);
        if (success) success(model, resp, options);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models);
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId  = {};
    },

    // Prepare a hash of attributes (or other model) to be added to this
    // collection.
    _prepareModel: function(attrs, options) {
      if (attrs instanceof Model) {
        if (!attrs.collection) attrs.collection = this;
        return attrs;
      }
      options = options ? _.clone(options) : {};
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model.validationError) return model;
      this.trigger('invalid', this, model.validationError, options);
      return false;
    },

    // Internal method to sever a model's ties to a collection.
    _removeReference: function(model) {
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event === 'add' || event === 'remove') && collection !== this) return;
      if (event === 'destroy') this.remove(model, options);
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        if (model.id != null) this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
  var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
    'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
    'lastIndexOf', 'isEmpty', 'chain'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function(method) {
    Collection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });

  // Backbone.View
  // -------------

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    options || (options = {});
    _.extend(this, _.pick(options, viewOptions));
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be preferred to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this.$el.remove();
      this.stopListening();
      return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;

        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.on(eventName, method);
        } else {
          this.$el.on(eventName, selector, method);
        }
      }
      return this;
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
        this.setElement($el, false);
      } else {
        this.setElement(_.result(this, 'el'), false);
      }
    }

  });

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // If we're sending a `PATCH` request, and we're in an old Internet Explorer
    // that still has ActiveX enabled by default, override jQuery to use that
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
    if (params.type === 'PATCH' && noXhrPatch) {
      params.xhr = function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
      };
    }

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  var noXhrPatch = typeof window !== 'undefined' && !!window.ActiveXObject && !(window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent);

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  // Override this if you'd like to use a different library.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        callback && callback.apply(router, args);
        router.trigger.apply(router, ['route:' + name].concat(args));
        router.trigger('route', name, args);
        Backbone.history.trigger('route', router, name, args);
      });
      return this;
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional) {
                     return optional ? match : '([^\/]+)';
                   })
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param) {
        return param ? decodeURIComponent(param) : null;
      });
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  // Cached regex for stripping urls of hash and query.
  var pathStripper = /[?#].*$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = this.location.pathname;
          var root = this.root.replace(trailingSlash, '');
          if (!fragment.indexOf(root)) fragment = fragment.slice(root.length);
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      if (oldIE && this._wantsHashChange) {
        this.iframe = Backbone.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        Backbone.$(window).on('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        Backbone.$(window).on('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = this.location;
      var atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;

      // Transition from hashChange to pushState or vice versa if both are
      // requested.
      if (this._wantsHashChange && this._wantsPushState) {

        // If we've started off with a route from a `pushState`-enabled
        // browser, but we're currently in a browser that doesn't support it...
        if (!this._hasPushState && !atRoot) {
          this.fragment = this.getFragment(null, true);
          this.location.replace(this.root + this.location.search + '#' + this.fragment);
          // Return immediately as browser will do redirect to new url
          return true;

        // Or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushState`-based instead...
        } else if (this._hasPushState && atRoot && loc.hash) {
          this.fragment = this.getHash().replace(routeStripper, '');
          this.history.replaceState({}, document.title, this.root + this.fragment + loc.search);
        }

      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      Backbone.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);
      clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment && this.iframe) {
        current = this.getFragment(this.getHash(this.iframe));
      }
      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl();
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragment) {
      fragment = this.fragment = this.getFragment(fragment);
      return _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: !!options};

      var url = this.root + (fragment = this.getFragment(fragment || ''));

      // Strip the fragment of the query and hash for matching.
      fragment = fragment.replace(pathStripper, '');

      if (this.fragment === fragment) return;
      this.fragment = fragment;

      // Don't include a trailing slash on the root.
      if (fragment === '' && url !== '/') url = url.slice(0, -1);

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) return this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

}).call(this);

},{"underscore":21}],19:[function(require,module,exports){

},{}],20:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],21:[function(require,module,exports){
//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {
    // Support ADDON SDK environment
    if (!setTimeout) {
        var timer = require('timer');

        setImmediate = timer.setImmediate;
        clearImmediate = timer.clearImmediate;
        setTimeout = setTimeout;
        setInterval = setInterval;
        clearTimeout = clearTimeout;
        clearInterval = clearInterval;
    }

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  //use the faster Date.now if available.
  var getTime = (Date.now || function() {
    return new Date().getTime();
  });

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.5.2';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? void 0 : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed > result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = value == null ? _.identity : lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, value, context) {
      var result = {};
      var iterator = value == null ? _.identity : lookupIterator(value);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n == null) || guard ? array[0] : slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) {
      return array[array.length - 1];
    } else {
      return slice.call(array, Math.max(array.length - n, 0));
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, "length").concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error("bindAll must be passed function names");
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : getTime();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now = getTime();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    return function() {
      context = this;
      args = arguments;
      timestamp = getTime();
      var later = function() {
        var last = getTime() - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) {
            result = func.apply(context, args);
            context = args = null;
          }
        }
      };
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}).call(this);

},{"timer":19}],22:[function(require,module,exports){
var process=require("__browserify_process");/**
 * Vow
 *
 * Copyright (c) 2012-2013 Filatov Dmitry (dfilatov@yandex-team.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 0.3.12
 */

(function(global) {

var Promise = function(val) {
    this._res = val;

    this._isFulfilled = !!arguments.length;
    this._isRejected = false;

    this._fulfilledCallbacks = [];
    this._rejectedCallbacks = [];
    this._progressCallbacks = [];
};

// Support ADDON SDK environment
if (!setTimeout) {
    var timer = require('timer');

    setImmediate = timer.setImmediate;
    clearImmediate = timer.clearImmediate;
    setTimeout = setTimeout;
    setInterval = setInterval;
    clearTimeout = clearTimeout;
    clearInterval = clearInterval;
}

Promise.prototype = {
    valueOf : function() {
        return this._res;
    },

    isFulfilled : function() {
        return this._isFulfilled;
    },

    isRejected : function() {
        return this._isRejected;
    },

    isResolved : function() {
        return this._isFulfilled || this._isRejected;
    },

    fulfill : function(val) {
        if(this.isResolved()) {
            return;
        }

        this._isFulfilled = true;
        this._res = val;

        this._callCallbacks(this._fulfilledCallbacks, val);
        this._fulfilledCallbacks = this._rejectedCallbacks = this._progressCallbacks = undef;
    },

    reject : function(err) {
        if(this.isResolved()) {
            return;
        }

        this._isRejected = true;
        this._res = err;

        this._callCallbacks(this._rejectedCallbacks, err);
        this._fulfilledCallbacks = this._rejectedCallbacks = this._progressCallbacks = undef;
    },

    notify : function(val) {
        if(this.isResolved()) {
            return;
        }

        this._callCallbacks(this._progressCallbacks, val);
    },

    then : function(onFulfilled, onRejected, onProgress, ctx) {
        if(onRejected && !isFunction(onRejected)) {
            ctx = onRejected;
            onRejected = undef;
        }
        else if(onProgress && !isFunction(onProgress)) {
            ctx = onProgress;
            onProgress = undef;
        }

        var promise = new Promise(),
            cb;

        if(!this._isRejected) {
            cb = { promise : promise, fn : isFunction(onFulfilled)? onFulfilled : undef, ctx : ctx };
            this._isFulfilled?
                this._callCallbacks([cb], this._res) :
                this._fulfilledCallbacks.push(cb);
        }

        if(!this._isFulfilled) {
            cb = { promise : promise, fn : onRejected, ctx : ctx };
            this._isRejected?
                this._callCallbacks([cb], this._res) :
                this._rejectedCallbacks.push(cb);
        }

        this.isResolved() || this._progressCallbacks.push({ promise : promise, fn : onProgress, ctx : ctx });

        return promise;
    },

    fail : function(onRejected, ctx) {
        return this.then(undef, onRejected, ctx);
    },

    always : function(onResolved, ctx) {
        var _this = this,
            cb = function() {
                return onResolved.call(this, _this);
            };

        return this.then(cb, cb, ctx);
    },

    progress : function(onProgress, ctx) {
        return this.then(undef, undef, onProgress, ctx);
    },

    spread : function(onFulfilled, onRejected, ctx) {
        return this.then(
            function(val) {
                return onFulfilled.apply(this, val);
            },
            onRejected,
            ctx);
    },

    done : function(onFulfilled, onRejected, onProgress, ctx) {
        this
            .then(onFulfilled, onRejected, onProgress, ctx)
            .fail(throwException);
    },

    delay : function(delay) {
        var timer,
            promise = this.then(function(val) {
                var promise = new Promise();
                timer = setTimeout(
                    function() {
                        promise.fulfill(val);
                    },
                    delay);

                return promise;
            });

        promise.always(function() {
            clearTimeout(timer);
        });

        return promise;
    },

    timeout : function(timeout) {
        var promise = new Promise(),
            timer = setTimeout(
                function() {
                    promise.reject(Error('timed out'));
                },
                timeout);

        promise.sync(this);
        promise.always(function() {
            clearTimeout(timer);
        });

        return promise;
    },

    sync : function(promise) {
        promise.then(
            this.fulfill,
            this.reject,
            this.notify,
            this);
    },

    _callCallbacks : function(callbacks, arg) {
        var len = callbacks.length;
        if(!len) {
            return;
        }

        var isResolved = this.isResolved(),
            isFulfilled = this.isFulfilled();

        nextTick(function() {
            var i = 0, cb, promise, fn;
            while(i < len) {
                cb = callbacks[i++];
                promise = cb.promise;
                fn = cb.fn;

                if(fn) {
                    var ctx = cb.ctx,
                        res;
                    try {
                        res = ctx? fn.call(ctx, arg) : fn(arg);
                    }
                    catch(e) {
                        promise.reject(e);
                        continue;
                    }

                    isResolved?
                        Vow.isPromise(res)?
                            (function(promise) {
                                res.then(
                                    function(val) {
                                        promise.fulfill(val);
                                    },
                                    function(err) {
                                        promise.reject(err);
                                    },
                                    function(val) {
                                        promise.notify(val);
                                    });
                            })(promise) :
                            promise.fulfill(res) :
                        promise.notify(res);
                }
                else {
                    isResolved?
                        isFulfilled?
                            promise.fulfill(arg) :
                            promise.reject(arg) :
                        promise.notify(arg);
                }
            }
        });
    }
};

var Vow = {
    Promise : Promise,

    promise : function(val) {
        return arguments.length?
            Vow.isPromise(val)?
                val :
                new Promise(val) :
            new Promise();
    },

    when : function(obj, onFulfilled, onRejected, onProgress, ctx) {
        return Vow.promise(obj).then(onFulfilled, onRejected, onProgress, ctx);
    },

    fail : function(obj, onRejected, ctx) {
        return Vow.when(obj, undef, onRejected, ctx);
    },

    always : function(obj, onResolved, ctx) {
        return Vow.promise(obj).always(onResolved, ctx);
    },

    progress : function(obj, onProgress, ctx) {
        return Vow.promise(obj).progress(onProgress, ctx);
    },

    spread : function(obj, onFulfilled, onRejected, ctx) {
        return Vow.promise(obj).spread(onFulfilled, onRejected, ctx);
    },

    done : function(obj, onFulfilled, onRejected, onProgress, ctx) {
        Vow.promise(obj).done(onFulfilled, onRejected, onProgress, ctx);
    },

    isPromise : function(obj) {
        return obj && isFunction(obj.then);
    },

    valueOf : function(obj) {
        return Vow.isPromise(obj)? obj.valueOf() : obj;
    },

    isFulfilled : function(obj) {
        return Vow.isPromise(obj)? obj.isFulfilled() : true;
    },

    isRejected : function(obj) {
        return Vow.isPromise(obj)? obj.isRejected() : false;
    },

    isResolved : function(obj) {
        return Vow.isPromise(obj)? obj.isResolved() : true;
    },

    fulfill : function(val) {
        return Vow.when(val, undef, function(err) {
            return err;
        });
    },

    reject : function(err) {
        return Vow.when(err, function(val) {
            var promise = new Promise();
            promise.reject(val);
            return promise;
        });
    },

    resolve : function(val) {
        return Vow.isPromise(val)? val : Vow.when(val);
    },

    invoke : function(fn) {
        try {
            return Vow.promise(fn.apply(global, slice.call(arguments, 1)));
        }
        catch(e) {
            return Vow.reject(e);
        }
    },

    forEach : function(promises, onFulfilled, onRejected, keys) {
        var len = keys? keys.length : promises.length,
            i = 0;
        while(i < len) {
            Vow.when(promises[keys? keys[i] : i], onFulfilled, onRejected);
            ++i;
        }
    },

    all : function(promises) {
        var resPromise = new Promise(),
            isPromisesArray = isArray(promises),
            keys = isPromisesArray?
                getArrayKeys(promises) :
                getObjectKeys(promises),
            len = keys.length,
            res = isPromisesArray? [] : {};

        if(!len) {
            resPromise.fulfill(res);
            return resPromise;
        }

        var i = len,
            onFulfilled = function() {
                if(!--i) {
                    var j = 0;
                    while(j < len) {
                        res[keys[j]] = Vow.valueOf(promises[keys[j++]]);
                    }
                    resPromise.fulfill(res);
                }
            },
            onRejected = function(err) {
                resPromise.reject(err);
            };

        Vow.forEach(promises, onFulfilled, onRejected, keys);

        return resPromise;
    },

    allResolved : function(promises) {
        var resPromise = new Promise(),
            isPromisesArray = isArray(promises),
            keys = isPromisesArray?
                getArrayKeys(promises) :
                getObjectKeys(promises),
            i = keys.length,
            res = isPromisesArray? [] : {};

        if(!i) {
            resPromise.fulfill(res);
            return resPromise;
        }

        var onProgress = function() {
                --i || resPromise.fulfill(promises);
            };

        Vow.forEach(promises, onProgress, onProgress, keys);

        return resPromise;
    },

    allPatiently : function(promises) {
        return Vow.allResolved(promises).then(function() {
            var isPromisesArray = isArray(promises),
                keys = isPromisesArray?
                    getArrayKeys(promises) :
                    getObjectKeys(promises),
                rejectedPromises, fulfilledPromises,
                len = keys.length, i = 0, key, promise;

            if(!len) {
                return isPromisesArray? [] : {};
            }

            while(i < len) {
                key = keys[i++];
                promise = promises[key];
                if(Vow.isRejected(promise)) {
                    rejectedPromises || (rejectedPromises = isPromisesArray? [] : {});
                    isPromisesArray?
                        rejectedPromises.push(promise.valueOf()) :
                        rejectedPromises[key] = promise.valueOf();
                }
                else if(!rejectedPromises) {
                    (fulfilledPromises || (fulfilledPromises = isPromisesArray? [] : {}))[key] = Vow.valueOf(promise);
                }
            }

            if(rejectedPromises) {
                throw rejectedPromises;
            }

            return fulfilledPromises;
        });
    },

    any : function(promises) {
        var resPromise = new Promise(),
            len = promises.length;

        if(!len) {
            resPromise.reject(Error());
            return resPromise;
        }

        var i = 0, err,
            onFulfilled = function(val) {
                resPromise.fulfill(val);
            },
            onRejected = function(e) {
                i || (err = e);
                ++i === len && resPromise.reject(err);
            };

        Vow.forEach(promises, onFulfilled, onRejected);

        return resPromise;
    },

    delay : function(val, timeout) {
        return Vow.promise(val).delay(timeout);
    },

    timeout : function(val, timeout) {
        return Vow.promise(val).timeout(timeout);
    }
};

var undef,
    nextTick = (function() {
        var fns = [],
            enqueueFn = function(fn) {
                return fns.push(fn) === 1;
            },
            callFns = function() {
                var fnsToCall = fns, i = 0, len = fns.length;
                fns = [];
                while(i < len) {
                    fnsToCall[i++]();
                }
            };

        if(typeof setImmediate === 'function') { // ie10, nodejs >= 0.10
            return function(fn) {
                enqueueFn(fn) && setImmediate(callFns);
            };
        }

        if(typeof process === 'object' && process.nextTick) { // nodejs < 0.10
            return function(fn) {
                enqueueFn(fn) && process.nextTick(callFns);
            };
        }

        if(global.postMessage) { // modern browsers
            var isPostMessageAsync = true;
            if(global.attachEvent) {
                var checkAsync = function() {
                        isPostMessageAsync = false;
                    };
                global.attachEvent('onmessage', checkAsync);
                global.postMessage('__checkAsync', '*');
                global.detachEvent('onmessage', checkAsync);
            }

            if(isPostMessageAsync) {
                var msg = '__promise' + +new Date,
                    onMessage = function(e) {
                        if(e.data === msg) {
                            e.stopPropagation && e.stopPropagation();
                            callFns();
                        }
                    };

                global.addEventListener?
                    global.addEventListener('message', onMessage, true) :
                    global.attachEvent('onmessage', onMessage);

                return function(fn) {
                    enqueueFn(fn) && global.postMessage(msg, '*');
                };
            }
        }

        var doc = global.document;
        if('onreadystatechange' in doc.createElement('script')) { // ie6-ie8
            var createScript = function() {
                    var script = doc.createElement('script');
                    script.onreadystatechange = function() {
                        script.parentNode.removeChild(script);
                        script = script.onreadystatechange = null;
                        callFns();
                };
                (doc.documentElement || doc.body).appendChild(script);
            };

            return function(fn) {
                enqueueFn(fn) && createScript();
            };
        }

        return function(fn) { // old browsers
            enqueueFn(fn) && setTimeout(callFns, 0);
        };
    })(),
    throwException = function(e) {
        nextTick(function() {
            throw e;
        });
    },
    isFunction = function(obj) {
        return typeof obj === 'function';
    },
    slice = Array.prototype.slice,
    toStr = Object.prototype.toString,
    isArray = Array.isArray || function(obj) {
        return toStr.call(obj) === '[object Array]';
    },
    getArrayKeys = function(arr) {
        var res = [],
            i = 0, len = arr.length;
        while(i < len) {
            res.push(i++);
        }
        return res;
    },
    getObjectKeys = Object.keys || function(obj) {
        var res = [];
        for(var i in obj) {
            obj.hasOwnProperty(i) && res.push(i);
        }
        return res;
    };

var defineAsGlobal = true;
if(typeof exports === 'object') {
    module.exports = Vow;
    defineAsGlobal = false;
}

if(typeof modules === 'object') {
    modules.define('vow', function(provide) {
        provide(Vow);
    });
    defineAsGlobal = false;
}

if(typeof define === 'function') {
    define(function(require, exports, module) {
        module.exports = Vow;
    });
    defineAsGlobal = false;
}

defineAsGlobal && (global.Vow = Vow);

})(this);

},{"__browserify_process":20,"timer":19}]},{},[1])
;