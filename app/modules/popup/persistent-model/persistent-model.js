angular.module('persistent-model', []).factory('PersistentModel', function () {
    return function (model, name) {
        var item = localStorage.getItem(name);

        if (item) {
            model = jQuery.extend(true, model, JSON.parse(item));
        }

        return model;
    };
});
