angular.module('persistent-set', []).factory('PersistentSet', function () {
    var constructor = function (name) {
        var item = localStorage.getItem(name);

        if (item) {
            this._set = JSON.parse(item);
        } else {
            this._set = [];
        }
        this._name = name;
    };
    constructor.prototype = {
        _save: function () {
            localStorage.setItem(
                this._name,
                JSON.stringify(this._set)
            );
        },
        toArray: function () {
            return this._set;
        },
        add: function (value) {
            this._set.push(value);
            this._save();
        },
        contains: function (value) {
            return this._set.indexOf(value) !== -1;
        },
        remove: function (value) {
            this._set.splice(this._set.indexOf(value), 1);
            this._save();
        }
    };

    return constructor;
});
