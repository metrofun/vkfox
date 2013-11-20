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