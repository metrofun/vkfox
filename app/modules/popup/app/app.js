angular.module('app', ['router', 'item', 'common', 'news', 'chat', 'buddies'])
    .run(function () {
        jQuery('body').tooltip({
            selector: '[title]',
            container: '.app',
            delay: { show: 1000, hide: false},
            placement: function () {
                var $container = jQuery(this.options.container),
                    containerOffset = $container.offset(),
                    offset = this.$element.offset(),
                    top = offset.top - containerOffset.top,
                    left = offset.left - containerOffset.top,
                    height = $container.outerHeight(),
                    width = $container.outerWidth(),
                    vert = 0.5 * height - top,
                    vertPlacement = vert > 0 ? 'bottom' : 'top',
                    horiz = 0.5 * width - left,
                    horizPlacement = horiz > 0 ? 'right' : 'left',
                    placement = Math.abs(horiz) > Math.abs(vert) ?  horizPlacement : vertPlacement;
                return placement;
            }
        });
    })
    .controller('navigationCtrl', function ($scope, $location) {
        $scope.locationPath = $location.path();
        $scope.$watch('location.path()', function (path) {
            $scope.locationPath = path;
        });
        $scope.tabs = [
            {
                href: '/chat',
                name: 'Chat'
            },
            {
                href: '/buddies',
                name: 'Buddies'
            },
            {
                href: '/news',
                name: 'News'
            }
        ];
    });
