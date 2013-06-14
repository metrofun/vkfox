angular.module('filters', ['config'])
    .filter('where', function () {
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
        return function (input) {
            if (input) {
                return [].concat(input).map(function (owner) {
                    if (owner.name) {
                        return owner.name;
                    } else {
                        return owner.first_name + ' ' + owner.last_name;
                    }
                }).join(', ');
            }
        };
    })
    // TODO legacy
    .filter('absoluteVkUrl', function (VK_BASE) {
        return function (url) {
            if ((url) && (url.substr(0, 4) !== 'http') && (url.substr(0, 4) !== 'www.')) {
                if (url.charAt(0) === '/') {
                    url = 'http://' + VK_BASE + url;
                } else {
                    url = 'http://' + VK_BASE + '/' + url;
                }
            }

            return url;
        };
    });
