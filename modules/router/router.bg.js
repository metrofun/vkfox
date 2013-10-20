/*jshint unused:false*/
angular.module('router', ['mediator', 'persistent-model'])
/**
 * Stores and updates 'lastPath' - last opened path bu user
 * communicates with popup's router
 *
 * @param {Object} PersistentModel
 * @param {methods} PersistentModel
 *
 * @returns {Object} Instance with public methods
 */
.factory('Router', function (PersistentModel, Mediator) {
    var model = new PersistentModel(
        {lastPath: '/chat'},
        {name: 'router'}
    );

    Mediator.sub('router:lastPath:get', function () {
        Mediator.pub('router:lastPath', model.get('lastPath'));
    });
    Mediator.sub('router:lastPath:put', function (lastPath) {
        model.set('lastPath', lastPath);
    });

    return {
        getLastPath: function () {
            return model.get('lastPath');
        }
    };
})
/**
 * Please note, that argument is important
 * to kick start loading of 'Router' service
 */
.run(function (Router) {});
