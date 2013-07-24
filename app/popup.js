// TODO rename to utils
angular.module('common', ['config', 'i18n'])
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

angular.module('config', [])
    .constant('VK_BASE', 'http://vk.com/');

/*global i18n */
angular.module('i18n', [])
    .config(function ($filterProvider) {
        $filterProvider.register('i18n', function () {
            var DEFAULT_LANGUAGE = 'ru',
                language = navigator.language.split('_')[0],
                messages;

            messages = i18n[language];

            if (!messages) {
                messages = i18n[DEFAULT_LANGUAGE];
            }

            return function (input) {
                if (input) {
                    return messages[input].apply(
                        messages,
                        [].slice.call(arguments, 1)
                    );
                }
            };
        });
    });

(function(){ window.i18n || (window.i18n = {}) 
var MessageFormat = { locale: {} };
MessageFormat.locale.ru = function (n) {
  if ((n % 10) == 1 && (n % 100) != 11) {
    return 'one';
  }
  if ((n % 10) >= 2 && (n % 10) <= 4 &&
      ((n % 100) < 12 || (n % 100) > 14) && n == Math.floor(n)) {
    return 'few';
  }
  if ((n % 10) === 0 || ((n % 10) >= 5 && (n % 10) <= 9) ||
      ((n % 100) >= 11 && (n % 100) <= 14) && n == Math.floor(n)) {
    return 'many';
  }
  return 'other';
};

window.i18n["ru"] = {}
window.i18n["ru"]["Private message"] = function(d){
var r = "";
r += "Личное сообщение";
return r;
}
window.i18n["ru"]["Wall post"] = function(d){
var r = "";
r += "Сообщение на стене";
return r;
}
window.i18n["ru"]["Search"] = function(d){
var r = "";
r += "Имя или Фамилия";
return r;
}
window.i18n["ru"]["Male"] = function(d){
var r = "";
r += "Мужчины";
return r;
}
window.i18n["ru"]["Female"] = function(d){
var r = "";
r += "Женщины";
return r;
}
window.i18n["ru"]["Offline"] = function(d){
var r = "";
r += "Не в сети";
return r;
}
window.i18n["ru"]["Bookmarked"] = function(d){
var r = "";
r += "В закладках";
return r;
}
window.i18n["ru"]["Monitor online status"] = function(d){
var r = "";
r += "Следить за онлайн статусом";
return r;
}
window.i18n["ru"]["Mark as read"] = function(d){
var r = "";
r += "Отметить прочитанным";
return r;
}
window.i18n["ru"]["Like"] = function(d){
var r = "";
r += "Нравится";
return r;
}
window.i18n["ru"]["more..."] = function(d){
var r = "";
r += "далee";
return r;
}
window.i18n["ru"]["Comment"] = function(d){
var r = "";
r += "Комментировать";
return r;
}
window.i18n["ru"]["Liked"] = function(d){
var r = "";
r += "Понравилось";
return r;
}
window.i18n["ru"]["Reposted"] = function(d){
var r = "";
r += "Поделился записью";
return r;
}
window.i18n["ru"]["New friends:"] = function(d){
var r = "";
r += "Новые друзья:";
return r;
}
window.i18n["ru"]["started following you"] = function(d){
var r = "";
r += "хочет добавить в друзья";
return r;
}
window.i18n["ru"]["sent a message"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
r += d["NAME"];
r += " ";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "прислал";
return r;
},
"female" : function(d){
var r = "";
r += "прислала";
return r;
},
"other" : function(d){
var r = "";
r += "прислал";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " сообщение";
return r;
}
window.i18n["ru"]["is online"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "появился";
return r;
},
"female" : function(d){
var r = "";
r += "появилась";
return r;
},
"other" : function(d){
var r = "";
r += "появился";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " в сети";
return r;
}
window.i18n["ru"]["went offline"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "вышел";
return r;
},
"female" : function(d){
var r = "";
r += "вышла";
return r;
},
"other" : function(d){
var r = "";
r += "вышел";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " из сети";
return r;
}
window.i18n["ru"]["left a comment"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
r += d["NAME"];
r += " ";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "оставил";
return r;
},
"female" : function(d){
var r = "";
r += "оставила";
return r;
},
"other" : function(d){
var r = "";
r += "оставил";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " комментарий";
return r;
}
window.i18n["ru"]["mentioned you"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "упомянул";
return r;
},
"female" : function(d){
var r = "";
r += "упомянула";
return r;
},
"other" : function(d){
var r = "";
r += "упомянул";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вас";
return r;
}
window.i18n["ru"]["posted on your wall"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "написал";
return r;
},
"female" : function(d){
var r = "";
r += "написала";
return r;
},
"other" : function(d){
var r = "";
r += "написал";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " на стене";
return r;
}
window.i18n["ru"]["liked your comment"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "оценил";
return r;
},
"female" : function(d){
var r = "";
r += "оценила";
return r;
},
"other" : function(d){
var r = "";
r += "оценил";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " ваш комментарий";
return r;
}
window.i18n["ru"]["liked your post"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "оценил";
return r;
},
"female" : function(d){
var r = "";
r += "оценила";
return r;
},
"other" : function(d){
var r = "";
r += "оценил";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вашу запись";
return r;
}
window.i18n["ru"]["liked your photo"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "оценил";
return r;
},
"female" : function(d){
var r = "";
r += "оценила";
return r;
},
"other" : function(d){
var r = "";
r += "оценил";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " ваше фото";
return r;
}
window.i18n["ru"]["liked your video"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "оценил";
return r;
},
"female" : function(d){
var r = "";
r += "оценила";
return r;
},
"other" : function(d){
var r = "";
r += "оценил";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " ваше видео";
return r;
}
window.i18n["ru"]["shared your post"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "поделился";
return r;
},
"female" : function(d){
var r = "";
r += "поделилась";
return r;
},
"other" : function(d){
var r = "";
r += "поделился";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вашей записью";
return r;
}
window.i18n["ru"]["shared your photo"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "поделился";
return r;
},
"female" : function(d){
var r = "";
r += "поделилась";
return r;
},
"other" : function(d){
var r = "";
r += "поделился";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вашим фото";
return r;
}
window.i18n["ru"]["shared your video"] = function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "GENDER";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"male" : function(d){
var r = "";
r += "поделился";
return r;
},
"female" : function(d){
var r = "";
r += "поделилась";
return r;
},
"other" : function(d){
var r = "";
r += "поделился";
return r;
}
};
r += (pf_0[ k_1 ] || pf_0[ "other" ])( d );
r += " вашим видео";
return r;
}
})();
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

angular.module('anchor', []).run(function () {
    jQuery('body').on('click', '[anchor]', function (e) {
        var jTarget = jQuery(e.currentTarget);

        chrome.tabs.create({url: jTarget.attr('anchor')});
    });
});

angular.module(
    'app',
    ['router', 'item', 'common', 'news', 'chat', 'buddies', 'tooltip']
);


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


angular.module('chat', ['item', 'mediator', 'request', 'rectify'])
    .controller('ChatCtrl', function ($scope, Mediator, Request) {
        $scope.markAsRead = function (messages) {
            Request.api({code: 'return API.messages.markAsRead({mids: ['
                + _.pluck(messages, 'mid') + ']});'});
        };

        Mediator.pub('chat:data:get');
        Mediator.sub('chat:data', function (data) {
            $scope.$apply(function () {
                $scope.data = data.dialogs.map(function (dialog) {
                    var firstMessage = dialog.messages[0], result = {};

                    if (dialog.messages[0].out) {
                        // find logined user profile
                        result.author = _(data.profiles).findWhere({
                            isSelf: true
                        });
                    } else if (dialog.chat_id) {
                        result.author = _(data.profiles).findWhere({
                            uid: firstMessage.uid
                        });
                    }
                    if (dialog.chat_id) {
                        result.owners = dialog.chat_active.map(function (uid) {
                            return _(data.profiles).findWhere({uid: uid});
                        });
                    } else {
                        result.owners = _(data.profiles).findWhere({
                            uid: dialog.uid
                        });
                    }

                    result.id = dialog.id;
                    result.messages = dialog.messages;
                    result.chat_id = dialog.chat_id;
                    result.uid = dialog.uid;
                    result.isUnread = dialog.messages[
                        dialog.messages.length - 1
                    ].read_state === 0;

                    return result;
                });
            });
        }.bind(this));
    });

angular.module('item-list', [])
    .directive('itemList', function () {
        return {
            templateUrl: '/modules/popup/item-list/item-list.tmpl.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            controller: function ($element) {
                this.getElement = function () {
                    return $element;
                };
            }
        };
    })
    .directive('itemListRepeat', function ($parse, $animator, $timeout) {
        var NG_REMOVED = '$$NG_REMOVED',
            RENDER_PADDING = 400,
            /**
             * This is the number of items,
             * that will be added in one event loop
             */
            BLOCKS_PER_LOOP = 5;
        /**
         * Computes a hash of an 'obj'.
         * Hash of a:
         *  string is string
         *  number is number as string
         *  object is either result of calling $$hashKey function on the object or uniquely generated id,
         *         that is also assigned to the $$hashKey property of the object.
         *
         * @param obj
         * @returns {string} hash string such that the same input will have the same hash string.
         *         The resulting string key is in 'type:hashKey' format.
         */
        function hashKey(obj) {
            var objType = typeof obj,
            key;

            if (objType === 'object' && obj !== null) {
                if (typeof (key = obj.$$hashKey) === 'function') {
                    // must invoke on object to keep the right this
                    key = obj.$$hashKey();
                } else if (key === undefined) {
                    key = obj.$$hashKey = _.uniqueId();
                }
            } else {
                key = obj;
            }

            return objType + ':' + key;
        }
        return {
            transclude: 'element',
            priority: 1000,
            terminal: true,
            require: '^itemList',
            compile: function (element, attr, linker) {
                return function ($scope, $element, $attr, itemListController) {
                    var animate = $animator($scope, $attr),
                        expression = $attr.itemListRepeat,
                        match = expression.match(/^\s*([\$\w]+)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/),
                        collectionIdentifier, valueIdentifier,
                        trackByExp, trackByIdFn, trackByExpGetter,
                        hashFnLocals = {},
                        lastBlockMap = {},
                        itemListElement = itemListController.getElement();

                    itemListElement = itemListElement;
                    if (!match) {
                        throw new Error("Expected itemListRepeat in form of '_item_ in _collection_[ track by _id_]' but got '" +
                        expression + "'.");
                    }

                    valueIdentifier = match[1];
                    collectionIdentifier = match[2];
                    trackByExp = match[4];

                    if (trackByExp) {
                        trackByExpGetter = $parse(trackByExp);
                        trackByIdFn = function (value) {
                            hashFnLocals[valueIdentifier] = value;
                            return trackByExpGetter($scope, hashFnLocals);
                        };
                    } else {
                        trackByIdFn = function (value) {
                            return hashKey(value);
                        };
                    }


                    function updateScrolledBlocks(collection, cursor, nextBlockOrder, nextBlockMap, offset) {
                        var index = offset || 0,
                            length = Math.min(index + BLOCKS_PER_LOOP, collection.length),
                            block, childScope, nextCursor,
                            scrollAreaBottom = itemListElement.offset().top
                                + itemListElement.height() + itemListElement.scrollTop();

                        if (cursor.offset().top > scrollAreaBottom + RENDER_PADDING) {
                            itemListElement.one('scroll', $scope.$apply.bind($scope, function () {
                                updateScrolledBlocks(
                                    collection,
                                    cursor,
                                    nextBlockOrder,
                                    nextBlockMap,
                                    index
                                );
                            }));
                            return;
                        }

                        // we are not using forEach for perf reasons (trying to avoid #call)
                        for (; index < length; index++) {
                            block = nextBlockOrder[index];

                            if (block.element) {
                                // if we have already seen this object, then we need to reuse the
                                // associated scope/element
                                childScope = block.scope;

                                nextCursor = cursor[0];
                                do {
                                    nextCursor = nextCursor.nextSibling;
                                } while (nextCursor && nextCursor[NG_REMOVED]);

                                if (block.element[0] === nextCursor) {
                                    // do nothing
                                    cursor = block.element;
                                } else {
                                    // existing item which got moved
                                    animate.move(block.element, null, cursor);
                                    cursor = block.element;
                                }
                            } else {
                                // new item which we don't know about
                                childScope = $scope.$new();
                            }

                            childScope[valueIdentifier] = collection[index];
                            childScope.$index = index;
                            childScope.$first = (index === 0);
                            childScope.$last = (index === (length - 1));
                            childScope.$middle = !(childScope.$first || childScope.$last);

                            if (!block.element) {
                                linker(childScope, function (clone) {
                                    animate.enter(clone, null, cursor);
                                    cursor = clone;
                                    block.scope = childScope;
                                    block.element = clone;
                                    nextBlockMap[block.id] = block;
                                });
                            }
                        }
                        if (index < collection.length) {
                            $timeout(function () {
                                updateScrolledBlocks(
                                    collection,
                                    cursor,
                                    nextBlockOrder,
                                    nextBlockMap,
                                    index
                                );
                            });
                        }
                    }

                    //watch props
                    $scope.$watchCollection(collectionIdentifier, function (collection) {
                        var index, length, key, trackById,
                            // Same as lastBlockMap but it has the current state. It will become the
                            // lastBlockMap on the next iteration.
                            nextBlockMap = {}, nextBlockOrder = [],
                            block;       // last object information {scope, element, id}

                        if (!collection) {
                            collection = [];
                        }
                        itemListElement.unbind('scroll');

                        // locate existing items
                        length = nextBlockOrder.length = collection.length;
                        for (index = 0; index < length; index++) {
                            trackById = trackByIdFn(collection[index]);
                            if (lastBlockMap[trackById]) {
                                block = lastBlockMap[trackById];
                                delete lastBlockMap[trackById];
                                nextBlockMap[trackById] = block;
                                nextBlockOrder[index] = block;
                            } else if (nextBlockMap.hasOwnProperty(trackById)) {
                                // This is a duplicate and we need to throw an error
                                throw new Error('Duplicates in a repeater are not allowed. Repeater: ' + expression +
                                ' key: ' + trackById);
                            } else {
                                // new never before seen block
                                nextBlockOrder[index] = { id: trackById };
                                nextBlockMap[trackById] = false;
                            }
                        }

                        // remove existing items that are were not moved to nextBlockMap
                        for (key in lastBlockMap) {
                            if (lastBlockMap.hasOwnProperty(key) && lastBlockMap[key].element) {
                                block = lastBlockMap[key];
                                animate.leave(block.element);
                                block.element[0][NG_REMOVED] = true;
                                block.scope.$destroy();
                            }
                        }

                        updateScrolledBlocks(collection, $element, nextBlockOrder, nextBlockMap);

                        lastBlockMap = nextBlockMap;
                    });
                };
            }
        };
    });

angular.module('item', ['common', 'ui.keypress', 'request', 'anchor', 'mediator'])
    .directive('item', function () {
        return {
            controller: function ($scope) {
                $scope.reply = {
                    visible: false
                };
                if (!Array.isArray($scope.owners)) {
                    if ($scope.owners.uid > 0) {
                        $scope.anchor = '/id' + $scope.owners.uid;
                    } else {
                        $scope.anchor = '/club' + $scope.owners.gid;
                    }
                }

                /**
                 * Show block with text message input
                 *
                 * @param {Function} onSend
                 * @param {String} placeholder
                 */
                this.showReply = function (onSend, placeholder) {
                    $scope.reply.onSend = onSend;
                    $scope.reply.placeholder = placeholder;
                    $scope.reply.visible = !$scope.reply.visible;
                };

                $scope.onReply = function (message) {
                    if (message.length > 1) {
                        $scope.reply.visible = false;
                        $scope.reply.onSend(message);
                    }
                };
            },
            templateUrl: '/modules/popup/item/item.tmpl.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                owners: '=',
                reply: '=?',
                'class': '@'
            }
        };
    })
    .directive('itemAttachment', function () {
        return {
            templateUrl: '/modules/popup/item/attachment.tmpl.html',
            replace: true,
            restrict: 'E',
            scope: {
                // TODO why @?
                type: '@',
                data: '='
            }
        };
    })
    .directive('itemActions', function () {
        return {
            template: '<div class="item__actions" ng-transclude></div>',
            replace: true,
            transclude: true,
            restrict: 'E'
        };
    })
    .directive('itemAction', function () {
        return {
            template: '<i class="item__action"></i>',
            replace: true,
            restrict: 'E'
        };
    })
    .directive('itemSendMessage', function (Request, $filter) {
        var title =  $filter('i18n')('Private message');

        return {
            transclude: true,
            require: '^item',
            restrict: 'A',
            scope: {
                uid: '=',
                chatId: '=?'
            },
            controller: function ($element, $transclude) {
                $transclude(function (clone) {
                    $element.append(clone);
                });
            },
            compile: function (tElement, tAttrs) {
                tAttrs.$set('title', title);
                return function (scope, element, attrs, itemCtrl) {
                    element.bind('click', function () {
                        scope.$apply(function () {
                            itemCtrl.showReply(function (message) {
                                var params = {
                                    message: message.trim()
                                };

                                if (scope.chatId) {
                                    params.chat_id = scope.chatId;
                                } else {
                                    params.uid = scope.uid;
                                }
                                console.log(scope, params);

                                Request.api({
                                    code: 'return API.messages.send(' + JSON.stringify(params) + ');'
                                });
                            }, title);
                        });
                    });
                };
            }
        };
    })
    .directive('itemPostWall', function (Request, $filter) {
        var title =  $filter('i18n')('Wall post');

        return {
            transclude: true,
            require: '^item',
            restrict: 'A',
            scope: {
                uid: '='
            },
            controller: function ($element, $transclude) {
                $transclude(function (clone) {
                    $element.append(clone);
                });
            },
            compile: function (tElement, tAttrs) {
                tAttrs.$set('title', title);
                return function (scope, element, attrs, itemCtrl) {
                    element.bind('click', function () {
                        scope.$apply(function () {
                            itemCtrl.showReply(function (message) {
                                var params = {
                                    message: message.trim(),
                                    owner_id: scope.uid
                                };

                                Request.api({
                                    code: 'return API.wall.post(' + JSON.stringify(params) + ');'
                                });
                            }, title);
                        });
                    });
                };
            }
        };
    })
    .directive('itemActionLike', function ($filter, Mediator) {
        var title =  $filter('i18n')('Like');

        return {
            templateUrl: '/modules/popup/item/action-like.tmpl.html',
            restrict: 'E',
            scope: {
                // Default type is 'post'
                type: '=?',
                ownerId: '=',
                itemId: '=',
                likes: '='
            },
            compile: function (tElement, tAttrs) {
                tAttrs.$set('title', title);

                return function (scope, element) {
                    element.bind('click', function () {
                        Mediator.pub('likes:change', {
                            action: scope.likes.user_likes ? 'delete':'add',
                            type: scope.type || 'post',
                            owner_id: scope.ownerId,
                            item_id: scope.itemId
                        });
                    });
                };
            }
        };
    })
    .directive('itemActionComment', function (Request, $filter) {
        var title =  $filter('i18n')('Comment');

        return {
            require: '^item',
            template: '<i class="item__action icon-comment"></i>',
            restrict: 'E',
            scope: {
                type: '=?',
                ownerId: '=?',
                id: '=?',
                replyTo: '=?',
                text: '='
            },
            compile: function (tElement, tAttrs) {
                tAttrs.$set('title', title);

                function onReply(scope, message) {
                    var params = {}, method;

                    switch (scope.type) {
                    case 'wall':
                    case 'post':
                        params.owner_id = scope.ownerId;
                        params.post_id = scope.id;
                        method = 'wall.addComment';
                        params.text = message;
                        if (scope.replyTo) {
                            params.reply_to_cid = scope.replyTo;
                        }
                        break;
                    case 'topic':
                        params.gid = Math.abs(scope.ownerId),
                        params.tid = scope.id,
                        params.text = message;
                        method = 'board.addComment';
                        break;
                    case 'photo':
                        params.oid = scope.ownerId,
                        params.pid = scope.id,
                        params.message = message;
                        method = 'photos.createComment';
                        break;
                    case 'video':
                        params.owner_id = scope.ownerId,
                        params.video_id = scope.id,
                        params.message = message;
                        method = 'video.createComment';
                        break;
                    }

                    if (method) {
                        Request.api({
                            code: 'return API.' + method + '(' + JSON.stringify(params) + ');'
                        });
                    }
                }

                return function (scope, element, attrs, itemCtrl) {
                    element.bind('click', function () {
                        scope.$apply(function () {
                            itemCtrl.showReply(onReply.bind(null, scope), title);
                        });
                    });
                };
            }
        };
    });

angular.module('mediator', [])
    .factory('Mediator', function () {
        var dispatcher = _.clone(Backbone.Events);

        chrome.extension.onMessage.addListener(function (messageData) {
            dispatcher.trigger.apply(dispatcher, messageData);
        });

        return {
            pub: function () {
                // dispatcher.trigger.apply(dispatcher, arguments);
                chrome.extension.sendMessage([].slice.call(arguments));
            },
            sub: function () {
                dispatcher.on.apply(dispatcher, arguments);
            },
            once: function () {
                dispatcher.once.apply(dispatcher, arguments);
            },
            unsub: function () {
                dispatcher.off.apply(dispatcher, arguments);
            }
        };
    });

angular.module('navigation', ['ui.route'])
    .directive('navigation', function ($routeParams) {
        return {
            controller: function ($scope) {
                $scope.tabs = [
                    {
                        href: 'chat',
                        name: 'Chat'
                    },
                    {
                        href: 'buddies',
                        name: 'Buddies'
                    },
                    {
                        href: 'news',
                        name: 'News'
                    }
                ];
                $scope.activeTab = $routeParams.tab;
            },
            templateUrl: '/modules/popup/navigation/navigation.tmpl.html',
            replace: true,
            restrict: 'E'
        };
    });

angular.module('news', ['mediator', 'navigation', 'rectify'])
    .controller('NewsController', function ($scope, $routeParams) {
        $scope.subtabs = [
            {
                href: 'news/my',
                text: 'My'
            },
            {
                href: 'news/friends',
                text: 'Friends'
            },
            {
                href: 'news/groups',
                text: 'Groups'
            }
        ];
        $scope.activeSubTab = $routeParams.subtab;
    })
    .controller('MyNewsController', function ($scope, Mediator) {
        Mediator.pub('feedbacks:data:get');
        Mediator.sub('feedbacks:data', function (data) {
            $scope.$apply(function () {
                $scope.data = data;

                if (data.items && data.items.length) {
                    data.items.forEach(function (item) {
                        var comment, parent = item.parent, type;

                        switch (item.type) {
                        case 'wall':
                        case 'post':
                        case 'mention':
                            if (parent.comments.can_post) {
                                comment = {
                                    ownerId: parent.owner_id,
                                    id: parent.id || parent.post_id,
                                    type: 'post'
                                };
                            }
                            break;
                        case 'comment':
                            if (parent.post && parent.post.comments.can_post) {
                                comment = {
                                    ownerId: parent.post.from_id,
                                    id: parent.post.id,
                                    replyTo: item.parent.id,
                                    type: 'post'
                                };
                            } else if (parent.topic && !parent.topic.is_closed) {
                                comment = {
                                    ownerId: parent.topic.owner_id,
                                    id: parent.topic.tid,
                                    type: 'topic'
                                };
                            } else {
                                if (parent.photo) {
                                    type = 'photo';
                                } else if (parent.video) {
                                    type = 'video';
                                }
                                if (type) {
                                    comment = {
                                        ownerId: parent[type].owner_id,
                                        id: parent[type].id,
                                        type: type
                                    };
                                }
                            }
                            break;
                        case 'topic':
                            comment = {
                                ownerId: parent.owner_id,
                                id: parent.id || parent.post_id,
                                type: 'topic'
                            };
                            break;
                        case 'photo':
                            comment = {
                                ownerId: parent.owner_id,
                                id: parent.pid,
                                type: 'photo'
                            };
                            break;
                        case 'video':
                            comment = {
                                ownerId: parent.owner_id,
                                id: parent.id || parent.vid,
                                type: 'video'
                            };
                            break;
                        }
                        item.comment = comment;
                    });
                }
            });
        });
    })
    .controller('FriendNewsController', function ($scope, Mediator) {
        Mediator.pub('newsfeed:friends:get');
        Mediator.sub('newsfeed:friends', function (data) {
            $scope.$apply(function () {
                $scope.data = data;
            });
        });
    })
    .controller('GroupNewsController', function ($scope, Mediator) {
        Mediator.pub('newsfeed:groups:get');
        Mediator.sub('newsfeed:groups', function (data) {
            $scope.$apply(function () {
                $scope.data = data;
            });
        });
    });

/*global linkify, jEmoji*/
angular.module(
    'rectify', ['i18n']
).filter('rectify', function ($filter) {
    var MAX_TEXT_LENGTH = 300,
        TRUNCATE_LENGTH = 200,

        label = $filter('i18n')('more...');

    jQuery('body').on('click', '.show-more', function (e) {
        var jTarget = jQuery(e.currentTarget);

        jTarget.replaceWith(linkifyAndEmoji(
            jTarget.data('text'),
            jTarget.data('emoji') === 'yes'
        ));
    });

    /**
     * Replaces all links with correspndenting anchors,
     * replaces next wiki format: [id12345|Dmitrii],
     * or [club32194285|Читать прoдoлжение..]
     * with <a anchor="http://vk.com/id12345">Dmitrii</a>
     * And repaces emoji unicodes with corrspondenting images
     *
     * @param {String} text
     * @returns {String} html
     */
    function linkifyAndEmoji(text, hasEmoji) {
        var linkifiedText = linkify(text, {
            callback: function (text, href) {
                return href ? '<a anchor="' + href + '">' + text + '</a>' : text;
            }
        });

        //replace wiki layout
        linkifiedText = linkifiedText.replace(
            /\[((?:id|club)\d+)\|([^\]]+)\]/g,
            '<a anchor="http://vk.com/$1">$2</a>'
        );

        return hasEmoji ? jEmoji.unifiedToHTML(linkifiedText):linkifiedText;
    }

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
     * Replaces text links and next wiki format: [id12345|Dmitrii]
     * with <a anchor="http://vk.com/id12345">Dmitrii</a>
     * And repaces emoji unicodes with corrspondenting images
     *
     * @param {String} text
     * @param {Boolean} hasEmoji If true, then we need to replace missing unicodes with images
     *
     * @returns {String} html-string
     */
    return function (text, hasEmoji) {
        var spaceIndex;

        if (text) {
            text = String(text);
            if (text.length > MAX_TEXT_LENGTH) {
                spaceIndex = text.indexOf(' ', TRUNCATE_LENGTH);

                if (spaceIndex !== -1) {
                    return linkifyAndEmoji(text.slice(0, spaceIndex), hasEmoji) + [
                        ' <span class="show-more btn rectify__button" data-text="',
                        escapeQuotes(text.slice(spaceIndex)), '" ',
                        hasEmoji ? 'data-emoji="yes" ':'',
                        'type="button">', label, '</span>'
                    ].join('');
                } else {
                    return linkifyAndEmoji(text, hasEmoji);
                }
            } else {
                return linkifyAndEmoji(text, hasEmoji);
            }
        }
    };
});

angular.module('request', ['mediator'])
    .factory('Request', function (Mediator) {
        return {
            api: function () {
                var ajaxDeferred = new jQuery.Deferred(),
                id = _.uniqueId();

                Mediator.pub('request', {
                    method: 'api',
                    id: id,
                    'arguments': [].slice.apply(arguments)
                });
                Mediator.once('request:' + id, function (data) {
                    ajaxDeferred[data.method].apply(ajaxDeferred, data['arguments']);
                    console.log(data['arguments']);
                });

                return ajaxDeferred;

            }
        };
    });

angular.module('router', ['mediator', 'persistent-model'])
    .config(function ($routeProvider, $locationProvider, $compileProvider) {
        $locationProvider.html5Mode(true);

        $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);

        $routeProvider
            .when('/news', {
                redirectTo: '/news/my'
            })
            .when('/:tab', {
                templateUrl: function (params) {
                    return [
                        '/modules/popup/', params.tab,
                        '/', params.tab, '.tmpl.html'
                    ].join('');
                }
            })
            .when('/:tab/:subtab', {
                templateUrl: function (params) {
                    return [
                        '/modules/popup/', params.tab,
                        '/', params.tab, '.tmpl.html'
                    ].join('');
                }
            });
    })
    .run(function ($location, $rootScope, Mediator, PersistentModel) {
        // default tab is chat
        var model = new PersistentModel(
            {lastPath: '/chat'},
            {name: 'router'}
        );
        $rootScope.$on('$routeChangeSuccess', function (scope, current) {
            Mediator.pub('router:change', current.params);
            if (current.params.tab) {
                model.set('lastPath', $location.path());
            }
        });
        Mediator.sub('notifications:queue', function (queue) {
            $rootScope.$apply(function () {
                if (queue.length) {
                    // queue contains updates from tabs.
                    // Property 'type' holds value
                    $location.path('/' + queue[queue.length - 1].type);
                } else {
                    $location.path(model.get('lastPath'));
                }
                $location.replace();
            });
        });
        Mediator.pub('notifications:queue:get');
    });

angular.module('tooltip', []).run(function () {
    jQuery('body').tooltip({
        selector: '[title]',
        delay: { show: 1000, hide: false},
        placement: 'bottom'
    });

    // Hide popup on click
    jQuery('body').on('show', '[title]', function (e) {
        jQuery(e.target).one('click', function () {
            jQuery(this).data('tooltip').$tip.remove();
        });
    });
});
