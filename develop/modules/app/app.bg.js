try {
    require('tracker/tracker.js').trackPage();
    require('browser/browser.bg.js');
    require('auth/auth.bg.js');
    require('auth-monitor/auth-monitor.bg.js');
    require('buddies/buddies.bg.js');
    require('chat/chat.bg.js');
    require('newsfeed/newsfeed.bg.js');
    require('feedbacks/feedbacks.bg.js');
    require('router/router.bg.js');
    require('likes/likes.bg.js');
    require('tracker/tracker.js');
    require('proxy-methods/proxy-methods.js');
    require('yandex/yandex.bg.js');
    require('force-online/force-online.bg.js');
    require('longpoll/longpoll.bg.js');
} catch (e)  {
    require('tracker/tracker.js').error(e.stack);
    throw e;
}
