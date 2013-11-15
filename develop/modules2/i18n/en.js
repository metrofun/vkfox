(function(){ window.i18n || (window.i18n = {}) 
var MessageFormat = { locale: {} };
MessageFormat.locale.en = function ( n ) {
  if ( n === 1 ) {
    return "one";
  }
  return "other";
};

window.i18n["en"] = {}
window.i18n["en"]["chat"] = function(d){
var r = "";
r += "chat";
return r;
}
window.i18n["en"]["news"] = function(d){
var r = "";
r += "news";
return r;
}
window.i18n["en"]["buddies"] = function(d){
var r = "";
r += "buddies";
return r;
}
window.i18n["en"]["my"] = function(d){
var r = "";
r += "my";
return r;
}
window.i18n["en"]["friends_nominative"] = function(d){
var r = "";
r += "friends";
return r;
}
window.i18n["en"]["groups_nominative"] = function(d){
var r = "";
r += "groups";
return r;
}
window.i18n["en"]["Private message"] = function(d){
var r = "";
r += "Private message";
return r;
}
window.i18n["en"]["Wall post"] = function(d){
var r = "";
r += "Wall post";
return r;
}
window.i18n["en"]["Search"] = function(d){
var r = "";
r += "First or last name";
return r;
}
window.i18n["en"]["Male"] = function(d){
var r = "";
r += "Male";
return r;
}
window.i18n["en"]["Female"] = function(d){
var r = "";
r += "Female";
return r;
}
window.i18n["en"]["Offline"] = function(d){
var r = "";
r += "Offline";
return r;
}
window.i18n["en"]["Bookmarked"] = function(d){
var r = "";
r += "Bookmarked";
return r;
}
window.i18n["en"]["Monitor online status"] = function(d){
var r = "";
r += "Monitor online status";
return r;
}
window.i18n["en"]["Mark as read"] = function(d){
var r = "";
r += "Mark as read";
return r;
}
window.i18n["en"]["Your message wasn't read"] = function(d){
var r = "";
r += "Your message wasn't read";
return r;
}
window.i18n["en"]["Like"] = function(d){
var r = "";
r += "Like";
return r;
}
window.i18n["en"]["Show history"] = function(d){
var r = "";
r += "Show history";
return r;
}
window.i18n["en"]["Open in New Tab"] = function(d){
var r = "";
r += "Open in New Tab";
return r;
}
window.i18n["en"]["unsubscribe"] = function(d){
var r = "";
r += "unsubscribe";
return r;
}
window.i18n["en"]["more..."] = function(d){
var r = "";
r += "more";
return r;
}
window.i18n["en"]["Comment"] = function(d){
var r = "";
r += "Comment";
return r;
}
window.i18n["en"]["Liked"] = function(d){
var r = "";
r += "Liked";
return r;
}
window.i18n["en"]["Reposted"] = function(d){
var r = "";
r += "Reposted";
return r;
}
window.i18n["en"]["New friends:"] = function(d){
var r = "";
r += "New friends:";
return r;
}
window.i18n["en"]["started following you"] = function(d){
var r = "";
r += "started following you";
return r;
}
window.i18n["en"]["friend request accepted"] = function(d){
var r = "";
r += "friend request accepted";
return r;
}
window.i18n["en"]["sent a message"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
r += d["NAME"];
r += " sent a message";
return r;
}
window.i18n["en"]["is online"] = function(d){
var r = "";
r += "is online";
return r;
}
window.i18n["en"]["is_online_short"] = function(d){
var r = "";
r += "appeared";
return r;
}
window.i18n["en"]["went offline"] = function(d){
var r = "";
r += "went offline";
return r;
}
window.i18n["en"]["went_offline_short"] = function(d){
var r = "";
r += "went";
return r;
}
window.i18n["en"]["left a comment"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
r += d["NAME"];
r += " left a comment";
return r;
}
window.i18n["en"]["mentioned you"] = function(d){
var r = "";
r += "mentioned you";
return r;
}
window.i18n["en"]["posted on your wall"] = function(d){
var r = "";
r += "posted on your wall";
return r;
}
window.i18n["en"]["liked your comment"] = function(d){
var r = "";
r += "liked your comment";
return r;
}
window.i18n["en"]["liked your post"] = function(d){
var r = "";
r += "liked your post";
return r;
}
window.i18n["en"]["liked your photo"] = function(d){
var r = "";
r += "liked your photo";
return r;
}
window.i18n["en"]["liked your video"] = function(d){
var r = "";
r += "liked your video";
return r;
}
window.i18n["en"]["shared your post"] = function(d){
var r = "";
r += "shared your post";
return r;
}
window.i18n["en"]["shared your photo"] = function(d){
var r = "";
r += "shared your photo";
return r;
}
window.i18n["en"]["shared your video"] = function(d){
var r = "";
r += "shared your video";
return r;
}
window.i18n["en"]["notifications"] = function(d){
var r = "";
r += "notifications";
return r;
}
window.i18n["en"]["force online"] = function(d){
var r = "";
r += "Be always online";
return r;
}
window.i18n["en"]["sound"] = function(d){
var r = "";
r += "sound";
return r;
}
window.i18n["en"]["signal"] = function(d){
var r = "";
r += "signal";
return r;
}
window.i18n["en"]["volume"] = function(d){
var r = "";
r += "volume";
return r;
}
window.i18n["en"]["popups"] = function(d){
var r = "";
r += "popups";
return r;
}
window.i18n["en"]["show text"] = function(d){
var r = "";
r += "show message text";
return r;
}
window.i18n["en"]["show all"] = function(d){
var r = "";
r += "show all";
return r;
}
window.i18n["en"]["hide"] = function(d){
var r = "";
r += "show less";
return r;
}
window.i18n["en"]["Yandex search"] = function(d){
var r = "";
r += "Yandex search";
return r;
}
window.i18n["en"]["install_noun"] = function(d){
var r = "";
r += "install";
return r;
}
window.i18n["en"]["install_verb"] = function(d){
var r = "";
r += "install";
return r;
}
window.i18n["en"]["skip"] = function(d){
var r = "";
r += "skip";
return r;
}
window.i18n["en"]["login"] = function(d){
var r = "";
r += "login";
return r;
}
window.i18n["en"]["accept"] = function(d){
var r = "";
r += "accept";
return r;
}
window.i18n["en"]["no"] = function(d){
var r = "";
r += "no";
return r;
}
window.i18n["en"]["close"] = function(d){
var r = "";
r += "close";
return r;
}
window.i18n["en"]["Authorize VKfox with Vkontakte"] = function(d){
var r = "";
r += "First you need to authorize VKfox to connect with VK.COM™. If you are doing this for the first time you will be asked to grant access to your account.";
return r;
}
window.i18n["en"]["Accept license agreement"] = function(d){
var r = "";
r += "By installing this application you agree to all terms, conditions, and information of the <a anchor='http://vkfox.org.ua/license'>license agreement.</a>";
return r;
}
window.i18n["en"]["Install Yandex search"] = function(d){
var r = "";
r += "Please consider supporting future development of VKfox by installing Yandex search.";
return r;
}
window.i18n["en"]["Thank you!"] = function(d){
var r = "";
r += "Thank you, installation is complete! Now this window can be closed.";
return r;
}
})();