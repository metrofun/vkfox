var Backbone = require('backbone'),
    storage = require('storage/storage.js');

module.exports = Backbone.Model.extend({
    /**
    * Stores and restores model from localStorage.
    * Requires 'name' in options, for localStorage key name
    *
    * @param {Object} attributes
    * @param {Object} options
    * @param {String} options.name
    */
    initialize: function (attributes, options) {
        var item;

        this._name = options.name;
        item = storage.getItem(this._name);

        if (item) {
            this.set(JSON.parse(item), {
                silent: true
            });
        }

        this.on('change', this._save.bind(this));
    },
    _save: function () {
        storage.setItem(this._name, JSON.stringify(this.toJSON()));
    }
});

