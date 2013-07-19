// TODO rename to utils
angular.module('common', ['config', 'i18n'])
    .filter('truncate', function ($filter) {
        var MAX_TEXT_LENGTH = 300,
            TRUNCATE_LENGTH = 200,

            label = $filter('i18n')('more...');

        jQuery('body').on('click', '.show-more', function (e) {
            var jTarget = jQuery(e.currentTarget);

            jTarget.replaceWith(jTarget.data('text'));
        });

        function escapeQuotes(string) {
            var entityMap = {
                '"': '&quot;',
                "'": '&#39;'
            };

            return String(string).replace(/["']/g, function (s) {
                return entityMap[s];
            });
        }
        /**
         * Truncates long text, and add pseudo-link "show-more"
         *
         * @param {String} text
         *
         * @returns {String}
         */
        return function (text) {
            var spaceIndex;

            if (text) {
                text = String(text);
                if (text.length > MAX_TEXT_LENGTH) {
                    spaceIndex = text.indexOf(' ', TRUNCATE_LENGTH);

                    if (spaceIndex !== -1) {
                        return  text.slice(0, spaceIndex) + [
                            ' <span class="show-more btn btn-mini" data-text="',
                            escapeQuotes(text.slice(spaceIndex)),
                            '" type="button">', label, '</span>'
                        ].join('');
                    } else {
                        return text;
                    }
                } else {
                    return text;
                }
            }
        };
    })
    .filter('duration', function () {
        /**
        * Returns time duration in format 'HH:mm'
        *
        * @param {Array} seconds
        *
        * @returns {String}
        */
        return function (seconds) {
            if (seconds) {
                return moment.unix(seconds).format('HH:mm');
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
                obj[property] = value;
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
    .filter('slice', function () {
        return function (arr, start, end) {
            if (arr) {
                return arr.slice(start, end);
            }
        };
    })
    .filter('isArray', function () {
        return function (input) {
            return angular.isArray(input);
        };
    });