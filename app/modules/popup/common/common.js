angular.module('common', ['config'])
    .directive('anchor', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.bind('click', function () {
                    chrome.tabs.create({url: attr['anchor']});
                });
            }
        };
    })
    .filter('where', function () {
        /**
         * Returns object from collection,
         * by it's key/value pair
         *
         * @param {Array} input
         * @param {String} property
         * @param {Mixed} value
         *
         * @returns {Object}
         */
        return function (input, property, value) {
            var obj;
            if (input) {
                obj  = {};
                obj[property] = value
                return _(input).findWhere(obj);
            }
        };
    })
    .filter('name', function () {
        /**
         * Returns names from profile's data
         *
         * @param {Object|Array} input
         *
         * @returns {String} String
         */
        return function (input) {
            if (input) {
                return [].concat(input).map(function (owner) {
                    //group profile
                    if (owner.name) {
                        return owner.name;
                    //user profile
                    } else {
                        return owner.first_name + ' ' + owner.last_name;
                    }
                }).join(', ');
            }
        };
    })
    .filter('addVKBase', function (VK_BASE) {
        return function (path) {
            if (path.indexOf(VK_BASE) === -1) {
                if (path.charAt(0) === '/') {
                    path = path.substr(1);
                }
                path = VK_BASE + path;
            }
            return path;
        };
    })
    .filter('isObject', function () {
        return function (input) {
            return angular.isObject(input);
        };
    })
    .filter('isArray', function () {
        return function (input) {
            return angular.isArray(input);
        };
    });


