(function(){ window.i18n || (window.i18n = {}) 
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

window.i18n["uk"] = {}
window.i18n["uk"]["chat"] = function(d){
var r = "";
r += "чат";
return r;
}
window.i18n["uk"]["news"] = function(d){
var r = "";
r += "новини";
return r;
}
window.i18n["uk"]["buddies"] = function(d){
var r = "";
r += "люди";
return r;
}
window.i18n["uk"]["my"] = function(d){
var r = "";
r += "мої";
return r;
}
window.i18n["uk"]["friends_nominative"] = function(d){
var r = "";
r += "друзів";
return r;
}
window.i18n["uk"]["groups_nominative"] = function(d){
var r = "";
r += "груп";
return r;
}
window.i18n["uk"]["Private message"] = function(d){
var r = "";
r += "Особисте повідомлення";
return r;
}
window.i18n["uk"]["Wall post"] = function(d){
var r = "";
r += "Повідомлення на стіні";
return r;
}
window.i18n["uk"]["Search"] = function(d){
var r = "";
r += "Ім'я або Прізвище";
return r;
}
window.i18n["uk"]["Male"] = function(d){
var r = "";
r += "Чоловіки";
return r;
}
window.i18n["uk"]["Female"] = function(d){
var r = "";
r += "Жінки";
return r;
}
window.i18n["uk"]["Offline"] = function(d){
var r = "";
r += "Не в мережі";
return r;
}
window.i18n["uk"]["Bookmarked"] = function(d){
var r = "";
r += "У закладках";
return r;
}
window.i18n["uk"]["Monitor online status"] = function(d){
var r = "";
r += "Слідкувати за онлайн статусом";
return r;
}
window.i18n["uk"]["Mark as read"] = function(d){
var r = "";
r += "Відзначити прочитаним";
return r;
}
window.i18n["uk"]["Your message wasn't read"] = function(d){
var r = "";
r += "Ваше повідомлення не прочитано";
return r;
}
window.i18n["uk"]["Like"] = function(d){
var r = "";
r += "Подобається";
return r;
}
window.i18n["uk"]["Show history"] = function(d){
var r = "";
r += "Показати історію";
return r;
}
window.i18n["uk"]["Open in New Tab"] = function(d){
var r = "";
r += "Відкрити у новому вікні";
return r;
}
window.i18n["uk"]["unsubscribe"] = function(d){
var r = "";
r += "відписатися";
return r;
}
window.i18n["uk"]["more..."] = function(d){
var r = "";
r += "далі";
return r;
}
window.i18n["uk"]["Comment"] = function(d){
var r = "";
r += "Коментувати";
return r;
}
window.i18n["uk"]["Liked"] = function(d){
var r = "";
r += "Сподобалось";
return r;
}
window.i18n["uk"]["Reposted"] = function(d){
var r = "";
r += "Поділився записом";
return r;
}
window.i18n["uk"]["New friends:"] = function(d){
var r = "";
r += "Нові друзі:";
return r;
}
window.i18n["uk"]["started following you"] = function(d){
var r = "";
r += "хоче додати у друзі";
return r;
}
window.i18n["uk"]["friend request accepted"] = function(d){
var r = "";
r += "заявка у друзі підтверджена";
return r;
}
window.i18n["uk"]["sent a message"] = function(d){
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
window.i18n["uk"]["is online"] = function(d){
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
window.i18n["uk"]["is_online_short"] = function(d){
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
window.i18n["uk"]["went offline"] = function(d){
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
window.i18n["uk"]["went_offline_short"] = function(d){
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
window.i18n["uk"]["left a comment"] = function(d){
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
window.i18n["uk"]["mentioned you"] = function(d){
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
window.i18n["uk"]["posted on your wall"] = function(d){
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
window.i18n["uk"]["liked your comment"] = function(d){
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
window.i18n["uk"]["liked your post"] = function(d){
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
window.i18n["uk"]["liked your photo"] = function(d){
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
window.i18n["uk"]["liked your video"] = function(d){
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
window.i18n["uk"]["shared your post"] = function(d){
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
window.i18n["uk"]["shared your photo"] = function(d){
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
window.i18n["uk"]["shared your video"] = function(d){
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
window.i18n["uk"]["notifications"] = function(d){
var r = "";
r += "повідомлення";
return r;
}
window.i18n["uk"]["force online"] = function(d){
var r = "";
r += "бути завжди он-лайн";
return r;
}
window.i18n["uk"]["sound"] = function(d){
var r = "";
r += "звук";
return r;
}
window.i18n["uk"]["signal"] = function(d){
var r = "";
r += "сигнал";
return r;
}
window.i18n["uk"]["volume"] = function(d){
var r = "";
r += "гучність";
return r;
}
window.i18n["uk"]["popups"] = function(d){
var r = "";
r += "спливаючі вікна";
return r;
}
window.i18n["uk"]["show all"] = function(d){
var r = "";
r += "показати усе";
return r;
}
window.i18n["uk"]["hide"] = function(d){
var r = "";
r += "приховати";
return r;
}
window.i18n["uk"]["show text"] = function(d){
var r = "";
r += "показувати текст";
return r;
}
window.i18n["uk"]["Yandex search"] = function(d){
var r = "";
r += "Яндекс пошук";
return r;
}
window.i18n["uk"]["install_noun"] = function(d){
var r = "";
r += "установка";
return r;
}
window.i18n["uk"]["install_verb"] = function(d){
var r = "";
r += "встановити";
return r;
}
window.i18n["uk"]["skip"] = function(d){
var r = "";
r += "пропустити";
return r;
}
window.i18n["uk"]["login"] = function(d){
var r = "";
r += "авторизувати";
return r;
}
window.i18n["uk"]["accept"] = function(d){
var r = "";
r += "прийняти";
return r;
}
window.i18n["uk"]["no"] = function(d){
var r = "";
r += "ні";
return r;
}
window.i18n["uk"]["close"] = function(d){
var r = "";
r += "закрити";
return r;
}
window.i18n["uk"]["Authorize VKfox with Vkontakte"] = function(d){
var r = "";
r += "Перш за все, необхідно авторизуватися у VKfox. Якщо ви це робите у перше, вам буде необхідно дозволити доступ до вашої сторінки.";
return r;
}
window.i18n["uk"]["Accept license agreement"] = function(d){
var r = "";
r += "Встановлюючи даний додаток ви погоджуєтесь з усіма правилами, умовами та інформацією нашої <a anchor='http: //vkfox.org.ua/license'>ліцензійної угоди.</a>";
return r;
}
window.i18n["uk"]["Install Yandex search"] = function(d){
var r = "";
r += "Будь ласка, підтримайте подальший розвиток VKfox та встановіть новий Яндекс пошук.";
return r;
}
window.i18n["uk"]["Thank you!"] = function(d){
var r = "";
r += "Дякуємо, установка додатку закінчена. Вікно може бути закрито.";
return r;
}
})();