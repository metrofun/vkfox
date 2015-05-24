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
module.exports["ru"]["chat"] = function(d){return "чат"}
module.exports["ru"]["news"] = function(d){return "новости"}
module.exports["ru"]["buddies"] = function(d){return "люди"}
module.exports["ru"]["my"] = function(d){return "мои"}
module.exports["ru"]["friends_nominative"] = function(d){return "друзей"}
module.exports["ru"]["groups_nominative"] = function(d){return "групп"}
module.exports["ru"]["Private message"] = function(d){return "Личное сообщение"}
module.exports["ru"]["Wall post"] = function(d){return "Сообщение на стене"}
module.exports["ru"]["Search"] = function(d){return "Имя или Фамилия"}
module.exports["ru"]["Male"] = function(d){return "Мужчины"}
module.exports["ru"]["Female"] = function(d){return "Женщины"}
module.exports["ru"]["Offline"] = function(d){return "Не в сети"}
module.exports["ru"]["Bookmarked"] = function(d){return "В закладках"}
module.exports["ru"]["Monitor online status"] = function(d){return "Следить за онлайн статусом"}
module.exports["ru"]["Mark as read"] = function(d){return "Отметить прочитанным"}
module.exports["ru"]["Your message wasn't read"] = function(d){return "Ваше сообщение не прочитано"}
module.exports["ru"]["Like"] = function(d){return "Нравится"}
module.exports["ru"]["Show history"] = function(d){return "Показать историю"}
module.exports["ru"]["Open in New Tab"] = function(d){return "Открыть в новом окне"}
module.exports["ru"]["unsubscribe"] = function(d){return "отписаться"}
module.exports["ru"]["more..."] = function(d){return "далee"}
module.exports["ru"]["Comment"] = function(d){return "Комментировать"}
module.exports["ru"]["Liked"] = function(d){return "Понравилось"}
module.exports["ru"]["Reposted"] = function(d){return "Поделился записью"}
module.exports["ru"]["New friends:"] = function(d){return "Новые друзья:"}
module.exports["ru"]["started following you"] = function(d){return "хочет добавить в друзья"}
module.exports["ru"]["friend request accepted"] = function(d){return "заявка в друзья подтверждена"}
module.exports["ru"]["sent a message"] = function(d){return v(d,"NAME")+" "+s(d,"GENDER",{"male":"прислал","female":"прислала","other":"прислал"})+" сообщение"}
module.exports["ru"]["is online"] = function(d){return s(d,"GENDER",{"male":"появился","female":"появилась","other":"появился"})+" в сети"}
module.exports["ru"]["is_online_short"] = function(d){return s(d,"GENDER",{"male":"появился","female":"появилась","other":"появился"})}
module.exports["ru"]["went offline"] = function(d){return s(d,"GENDER",{"male":"вышел","female":"вышла","other":"вышел"})+" из сети"}
module.exports["ru"]["went_offline_short"] = function(d){return s(d,"GENDER",{"male":"вышел","female":"вышла","other":"вышел"})}
module.exports["ru"]["left a comment"] = function(d){return v(d,"NAME")+" "+s(d,"GENDER",{"male":"оставил","female":"оставила","other":"оставил"})+" комментарий"}
module.exports["ru"]["mentioned you"] = function(d){return s(d,"GENDER",{"male":"упомянул","female":"упомянула","other":"упомянул"})+" вас"}
module.exports["ru"]["posted on your wall"] = function(d){return s(d,"GENDER",{"male":"написал","female":"написала","other":"написал"})+" на стене"}
module.exports["ru"]["liked your comment"] = function(d){return s(d,"GENDER",{"male":"оценил","female":"оценила","other":"оценил"})+" ваш комментарий"}
module.exports["ru"]["liked your post"] = function(d){return s(d,"GENDER",{"male":"оценил","female":"оценила","other":"оценил"})+" вашу запись"}
module.exports["ru"]["liked your photo"] = function(d){return s(d,"GENDER",{"male":"оценил","female":"оценила","other":"оценил"})+" ваше фото"}
module.exports["ru"]["liked your video"] = function(d){return s(d,"GENDER",{"male":"оценил","female":"оценила","other":"оценил"})+" ваше видео"}
module.exports["ru"]["shared your post"] = function(d){return s(d,"GENDER",{"male":"поделился","female":"поделилась","other":"поделился"})+" вашей записью"}
module.exports["ru"]["shared your photo"] = function(d){return s(d,"GENDER",{"male":"поделился","female":"поделилась","other":"поделился"})+" вашим фото"}
module.exports["ru"]["shared your video"] = function(d){return s(d,"GENDER",{"male":"поделился","female":"поделилась","other":"поделился"})+" вашим видео"}
module.exports["ru"]["notifications"] = function(d){return "уведомления"}
module.exports["ru"]["force online"] = function(d){return "быть всегда он-лайн"}
module.exports["ru"]["sound"] = function(d){return "звук"}
module.exports["ru"]["signal"] = function(d){return "сигнал"}
module.exports["ru"]["volume"] = function(d){return "громкость"}
module.exports["ru"]["popups"] = function(d){return "всплывающие окна"}
module.exports["ru"]["show text"] = function(d){return "показывать текст"}
module.exports["ru"]["show all"] = function(d){return "показать все"}
module.exports["ru"]["hide"] = function(d){return "скрыть"}
module.exports["ru"]["Yandex search"] = function(d){return "Яндекс поиск"}
module.exports["ru"]["install_noun"] = function(d){return "установка"}
module.exports["ru"]["install_verb"] = function(d){return "установить"}
module.exports["ru"]["skip"] = function(d){return "пропустить"}
module.exports["ru"]["login"] = function(d){return "авторизовать"}
module.exports["ru"]["accept"] = function(d){return "принять"}
module.exports["ru"]["no"] = function(d){return "нет"}
module.exports["ru"]["close"] = function(d){return "закрыть"}
module.exports["ru"]["Authorize VKfox with Vkontakte"] = function(d){return "Прежде всего, необходимо авторизироваться в VKfox. Если вы это делаете в первые вам будет необходимо разрешить доступ к вашей странице."}
module.exports["ru"]["Accept license agreement"] = function(d){return "Устанавливая данное приложение вы тем самым соглашаетесь со всеми правилами, условиями и информацией нашего <a anchor='http://vkfox.io/license'>лицензионного соглашения.</a>"}
module.exports["ru"]["Install Yandex search"] = function(d){return "Пожалуйста, поддержите дальнейшее развитие VKfox и установите новый Яндекс поиск."}
module.exports["ru"]["Thank you!"] = function(d){return "Спасибо, установка приложения окончена. Окно может быть закрыто."}
})();