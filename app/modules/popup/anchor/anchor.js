angular.module('anchor', []).directive('anchor', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function () {
                chrome.tabs.create({url: attr.anchor});
            });
        }
    };
});
