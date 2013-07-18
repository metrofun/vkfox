angular.module('persistent-model', []).factory('PersistentModel', function () {
    return Backbone.Model.extend({
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
            item = localStorage.getItem(this._name);

            if (item) {
                this.set(JSON.parse(item), {
                    silent: true
                });
            }

            this.on('change', this._save.bind(this));
        },
        _save: function () {
            localStorage.setItem(this._name, JSON.stringify(this.toJSON()));
        }
    });
});
