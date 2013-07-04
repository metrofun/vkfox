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
window.i18n["ru"]["Filters"] = function(d){
var r = "";
r += "Фильтры";
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
})();