define(['i18n/i18n'], function (I18N) {
    var i18n = new I18N();

    i18n.decl('chat', {
        'ru': 'Диалоги',
        'en': 'Chat'
    });
    i18n.decl('updates', {
        'ru': 'Обновления',
        'en': 'Updates'
    });
    i18n.decl('buddies', {
        'ru': 'Люди',
        'en': 'Buddies'
    });

    return i18n;
});
