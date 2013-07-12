angular.module(
    'profiles-collection',
    ['request', 'mediator', 'longpoll']
).factory('ProfilesCollection', function (Request, Mediator) {
    return Backbone.Collection.extend({
        initialize: function () {
            Mediator.sub('longpoll:updates', this._onUpdates.bind(this));
        },
        /**
         * @see http://vk.com/developers.php?oid=-17680044&p=Connecting_to_the_LongPoll_Server
         *
         * @param [Array] updates
         */
        _onUpdates: function (updates) {
            updates.forEach(function (update) {
                var type = update[0],
                    userId = Math.abs(update[1]), model;

                // 8,-$user_id,0 -- друг $user_id стал онлайн
                // 9,-$user_id,$flags -- друг $user_id стал оффлайн
                // ($flags равен 0, если пользователь покинул сайт (например, нажал выход) и 1,
                // если оффлайн по таймауту (например, статус away))
                if (type === 9 || type === 8) {
                    model = this.get(Number(userId));
                    if (model) {
                        model.set('online', Number(type === 8));
                    }
                }
            }, this);
        }
    });
});
