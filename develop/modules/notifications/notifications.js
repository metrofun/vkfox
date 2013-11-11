// If module doesn't exist, then create it
try {
    angular.module('notifications');
} catch (e) {
    angular.module('notifications', []);
}
angular.module('notifications')
    .constant('NOTIFICATIONS_SOUNDS', {
        standart: 'modules/notifications/standart.ogg',
        original: 'modules/notifications/original.ogg'
    });

