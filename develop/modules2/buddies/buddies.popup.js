angular.module('buddies', ['i18n', 'item-list', 'mediator', 'persistent-model', 'common'])
    .controller('buddiesCtrl', function ($scope, $element, Mediator, PersistentModel, $filter) {
        var filtersModel = new PersistentModel({
            male: true,
            female: true,
            offline: false,
            faves: true
        }, {name: 'buddiesFilters'});

        $scope.filters = filtersModel.toJSON();
        $scope.$watch('filters', function (filters) {
            filtersModel.set(filters);
        }, true);

        $element.find('.dropdown-toggle').dropdown();

        $scope.toggleFriendWatching = function (profile) {
            profile.isWatched = !profile.isWatched;
            Mediator.pub('buddies:watch:toggle', profile.uid);
        };

        Mediator.pub('buddies:data:get');
        Mediator.sub('buddies:data', function (data) {
            $scope.$apply(function () {
                data.filter(function (buddie) {
                    return buddie.lastActivityTime;
                }).forEach(function (buddie) {
                    var gender = buddie.sex === 1 ? 'female':'male';

                    buddie.description = $filter('i18n')(
                        buddie.online ? 'is_online_short':'went_offline_short',
                        gender
                    ) + ' ' + $filter('timeago')(buddie.lastActivityTime);
                });
                $scope.data = data;
            });
        }.bind(this));
        $scope.$on('$destroy', function () {
            Mediator.unsub('buddies:data');
        });
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
        return function (input, filters, searchClue) {
            if (Array.isArray(input)) {
                return input.filter(function (profile) {
                    if (!searchClue) {
                        return profile.isWatched || (
                            (filters.offline || profile.online)
                            // if "male" is checked, then proceed,
                            // otherwise the profile should be a male
                            && ((filters.male || profile.sex !== 2) && (filters.female || profile.sex !== 1))
                            && (filters.faves || !profile.isFave)
                        );
                    } else {
                        return matchProfile(profile, searchClue);
                    }
                });
            }
        };
    });
