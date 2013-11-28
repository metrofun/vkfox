var Mediator = require('mediator/mediator.js'),
    PersistentModel = require('persistent-model/persistent-model.js'),
    I18N = require('i18n/i18n.js'),
    $ = require('zepto');

require('navigation/navigation.pu.js');
require('item-list/item-list.pu.js');
require('item/item.pu.js');
require('filters/filters.pu.js');
require('bootstrapDropdown');
require('angular').module('app')
    .controller('buddiesCtrl', function ($scope, $element) {
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

        console.log($.fn);
        $($element).find('.dropdown-toggle').dropdown();

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

                    buddie.description = I18N.get(
                        buddie.online ? 'is_online_short':'went_offline_short',
                        gender
                    ) + ' ' + I18N.get('timeago')(buddie.lastActivityTime);
                });
                $scope.data = data;
            });
        }.bind(this));
        $scope.$on('$destroy', function () {
            Mediator.unsub('buddies:data');
        });
    })
    .filter('buddiesFilter', function () {
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
            return I18N.get('name')(profile)
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
