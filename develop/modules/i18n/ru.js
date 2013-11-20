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
