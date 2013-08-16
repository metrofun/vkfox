angular.module('buddies', ['i18n', 'item-list', 'mediator'])
    .controller('buddiesCtrl', function ($scope, $element, Mediator) {
        $scope.filters = {
            male: true,
            female: true,
            offline: false,
            faves: true
        };
        $element.find('.dropdown-toggle').dropdown();

        $scope.toggleFriendWatching = function (profile) {
            profile.isWatched = !profile.isWatched;
            Mediator.pub('buddies:watch:toggle', profile.uid);
        };

        Mediator.pub('buddies:data:get');
        Mediator.sub('buddies:data', function (data) {
            $scope.$apply(function () {
                $scope.data = data;
            });
        }.bind(this));
    })
    .filter('buddiesFilter', function ($filter) {
        /**
         * Says if profile matched search clue.
         * Uses lowercasing of arguments
         *
         * @params [Object] profile
         * @param [String] searchClue
         *
         * @returns [Boolean]
         */
        function matchProfile(profile, searchClue) {
            return $filter('name')(profile)
                .toLowerCase()
                .indexOf(searchClue.toLowerCase()) !== -1;
        }
        /**
         * @param [Array] input profiles array
         * @param [Object] filters Filtering rules
         * @param [Boolean] filters.male If false, no man will be returned
         * @param [Boolean] filter.female
         * @param [Boolean] filters.offline
         * @param [Number] count Maximum number filtered results
         * @param [String] searchClue Search clue
         *
         * @returns [Array]
         */
        return function (input, filters, count, searchClue) {
            if (Array.isArray(input)) {
                return input.filter(function (profile) {
                    if (!searchClue) {
                        return (filters.offline || profile.online) && (
                            (filters.male || profile.sex !== 2)
                            && (filters.female || profile.sex !== 1)
                        ) && (filters.faves || !profile.isFave);
                    } else {
                        return matchProfile(profile, searchClue);
                    }
                });
            }
        };
    });
