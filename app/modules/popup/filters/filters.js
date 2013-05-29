angular.module('filters', ['config'])
    .filter('name', function () {
        return function (input) {
            if (input) {
                if (input.name) {
                    return input.name;
                } else {
                    return input.first_name + ' ' + input.last_name;
                }
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
