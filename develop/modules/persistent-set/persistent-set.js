var
storage = require('modules/storage/storage.js'),
constructor = function (name) {
    var item = storage.getItem(name);

    if (item) {
        this._set = JSON.parse(item);
    } else {
        this._set = [];
    }
    this._name = name;
};
constructor.prototype = {
    _save: function () {
        storage.setItem(
            this._name,
            JSON.stringify(this._set)
        );
    },
    toArray: function () {
        return this._set;
    },
    add: function (value) {
        if (!this.contains(value)) {
            this._set.push(value);
            this._save();
        }
    },
    contains: function (value) {
        return this._set.indexOf(value) !== -1;
    },
    remove: function (value) {
        var position = this._set.indexOf(value);
        if (position !== -1) {
            this._set.splice(position, 1);
            this._save();
        }
    },
    size: function () {
        return this._set.length;
    }
};

module.exports = constructor;
