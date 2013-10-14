angular.module('item-list', [])
    .directive('itemList', function () {
        return {
            templateUrl: '/modules/item-list/item-list.tmpl.html',
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
