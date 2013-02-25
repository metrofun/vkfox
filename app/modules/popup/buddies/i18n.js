define(['i18n/i18n'], function (I18N) {
    var i18n = new I18N();

    i18n.decl('watch-online-status', {
        'ru': 'Уведомлять о смене статуса online',
        'en': 'Notify about online status changed'
    });
    i18n.decl('favourite', {
        'ru': 'В избранное',
        'en': 'Favourite'
    });

    return i18n;
});
