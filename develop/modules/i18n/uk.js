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
module.exports["uk"]["chat"] = function(d){return "чат"}
module.exports["uk"]["news"] = function(d){return "новини"}
module.exports["uk"]["buddies"] = function(d){return "люди"}
module.exports["uk"]["my"] = function(d){return "мої"}
module.exports["uk"]["friends_nominative"] = function(d){return "друзів"}
module.exports["uk"]["groups_nominative"] = function(d){return "груп"}
module.exports["uk"]["Private message"] = function(d){return "Особисте повідомлення"}
module.exports["uk"]["Wall post"] = function(d){return "Повідомлення на стіні"}
module.exports["uk"]["Search"] = function(d){return "Ім'я або Прізвище"}
module.exports["uk"]["Male"] = function(d){return "Чоловіки"}
module.exports["uk"]["Female"] = function(d){return "Жінки"}
module.exports["uk"]["Offline"] = function(d){return "Не в мережі"}
module.exports["uk"]["Bookmarked"] = function(d){return "У закладках"}
module.exports["uk"]["Monitor online status"] = function(d){return "Слідкувати за онлайн статусом"}
module.exports["uk"]["Mark as read"] = function(d){return "Відзначити прочитаним"}
module.exports["uk"]["Your message wasn't read"] = function(d){return "Ваше повідомлення не прочитано"}
module.exports["uk"]["Like"] = function(d){return "Подобається"}
module.exports["uk"]["Show history"] = function(d){return "Показати історію"}
module.exports["uk"]["Open in New Tab"] = function(d){return "Відкрити у новому вікні"}
module.exports["uk"]["unsubscribe"] = function(d){return "відписатися"}
module.exports["uk"]["more..."] = function(d){return "далі"}
module.exports["uk"]["Comment"] = function(d){return "Коментувати"}
module.exports["uk"]["Liked"] = function(d){return "Сподобалось"}
module.exports["uk"]["Reposted"] = function(d){return "Поділився записом"}
module.exports["uk"]["New friends:"] = function(d){return "Нові друзі:"}
module.exports["uk"]["started following you"] = function(d){return "хоче додати у друзі"}
module.exports["uk"]["friend request accepted"] = function(d){return "заявка у друзі підтверджена"}
module.exports["uk"]["sent a message"] = function(d){return v(d,"NAME")+" "+s(d,"GENDER",{"male":"надіслав","female":"надіслала","other":"надіслав"})+" повідомлення"}
module.exports["uk"]["is online"] = function(d){return s(d,"GENDER",{"male":"з'явився","female":"з'явилася","other":"з'явився"})+" в мережі"}
module.exports["uk"]["is_online_short"] = function(d){return s(d,"GENDER",{"male":"з'явився","female":"з'явилася","other":"з'явився"})}
module.exports["uk"]["went offline"] = function(d){return s(d,"GENDER",{"male":"вийшов","female":"вийшла","other":"вийшов"})+" з мережі"}
module.exports["uk"]["went_offline_short"] = function(d){return s(d,"GENDER",{"male":"вийшов","female":"вийшла","other":"вийшов"})}
module.exports["uk"]["left a comment"] = function(d){return v(d,"NAME")+" "+s(d,"GENDER",{"male":"залишив","female":"залишила","other":"залишив"})+" коментар"}
module.exports["uk"]["mentioned you"] = function(d){return s(d,"GENDER",{"male":"згадав","female":"згадала","other":"згадав"})+" вас"}
module.exports["uk"]["posted on your wall"] = function(d){return s(d,"GENDER",{"male":"написав","female":"написала","other":"написав"})+" на стіні"}
module.exports["uk"]["liked your comment"] = function(d){return s(d,"GENDER",{"male":"оцінив","female":"оцінила","other":"оцінив"})+" ваш коментар"}
module.exports["uk"]["liked your post"] = function(d){return s(d,"GENDER",{"male":"оцінив","female":"оцінила","other":"оцінив"})+" вашу запис"}
module.exports["uk"]["liked your photo"] = function(d){return s(d,"GENDER",{"male":"оцінив","female":"оцінила","other":"оцінив"})+" ваше фото"}
module.exports["uk"]["liked your video"] = function(d){return s(d,"GENDER",{"male":"оцінив","female":"оцінила","other":"оцінив"})+" ваше відео"}
module.exports["uk"]["shared your post"] = function(d){return s(d,"GENDER",{"male":"поділився","female":"поділилася","other":"поділився"})+" вашим записом"}
module.exports["uk"]["shared your photo"] = function(d){return s(d,"GENDER",{"male":"поділився","female":"поділилася","other":"поділився"})+" вашим фото"}
module.exports["uk"]["shared your video"] = function(d){return s(d,"GENDER",{"male":"поділився","female":"поділилася","other":"поділився"})+" вашим відео"}
module.exports["uk"]["notifications"] = function(d){return "повідомлення"}
module.exports["uk"]["force online"] = function(d){return "бути завжди он-лайн"}
module.exports["uk"]["sound"] = function(d){return "звук"}
module.exports["uk"]["signal"] = function(d){return "сигнал"}
module.exports["uk"]["volume"] = function(d){return "гучність"}
module.exports["uk"]["popups"] = function(d){return "спливаючі вікна"}
module.exports["uk"]["show all"] = function(d){return "показати усе"}
module.exports["uk"]["hide"] = function(d){return "приховати"}
module.exports["uk"]["show text"] = function(d){return "показувати текст"}
module.exports["uk"]["Yandex search"] = function(d){return "Яндекс пошук"}
module.exports["uk"]["install_noun"] = function(d){return "установка"}
module.exports["uk"]["install_verb"] = function(d){return "встановити"}
module.exports["uk"]["skip"] = function(d){return "пропустити"}
module.exports["uk"]["login"] = function(d){return "авторизувати"}
module.exports["uk"]["accept"] = function(d){return "прийняти"}
module.exports["uk"]["no"] = function(d){return "ні"}
module.exports["uk"]["close"] = function(d){return "закрити"}
module.exports["uk"]["Authorize VKfox with Vkontakte"] = function(d){return "Перш за все, необхідно авторизуватися у VKfox. Якщо ви це робите у перше, вам буде необхідно дозволити доступ до вашої сторінки."}
module.exports["uk"]["Accept license agreement"] = function(d){return "Встановлюючи даний додаток ви погоджуєтесь з усіма правилами, умовами та інформацією нашої <a anchor='http://vkfox.io/license'>ліцензійної угоди.</a>"}
module.exports["uk"]["Install Yandex search"] = function(d){return "Будь ласка, підтримайте подальший розвиток VKfox та встановіть новий Яндекс пошук."}
module.exports["uk"]["Thank you!"] = function(d){return "Дякуємо, установка додатку закінчена. Вікно може бути закрито."}
})();