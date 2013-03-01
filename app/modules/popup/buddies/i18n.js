define(['i18n/i18n'], function (I18N) {
    var i18n = new I18N();

    i18n.decl('watch-online-status', {
        'ru': 'Следить за сменой статуса online',
        'en': 'Notify about online status changed'
    });
    i18n.decl('favourite', {
        'ru': 'В избранное',
        'en': 'Favourite'
    });
    i18n.decl('watch', {
        'ru': 'Следить',
        'en': 'Watch'
    });
    i18n.decl('filter', {
        'ru': 'Фильтр',
        'en': 'Filter'
    });
    i18n.decl('offline', {
        'ru': 'не в сети',
        'en': 'offline'
    });
    i18n.decl('male', {
        'ru': 'мужчины',
        'en': 'male'
    });
    i18n.decl('female', {
        'ru': 'женщины',
        'en': 'male'
    });

    return i18n;
});
