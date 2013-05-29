angular.module('app', ['router', 'item', 'filters', 'news'])
    .controller('navigationCtrl', function ($scope, $location) {
        $scope.locationPath = $location.path();
        $scope.location = $location;
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
    })
    .controller('buddiesCtrl', function ($scope, mediator) {
        var PRELOAD_ITEMS = 15;

        mediator.pub('buddies:data:get');
        mediator.sub('buddies:data', function (data) {
            $scope.$apply(function () {
                $scope.data = data.slice(0, PRELOAD_ITEMS);
            });
        }.bind(this));
    })
    .controller('chatCtrl', function ($scope, mediator) {
        mediator.pub('chat:data:get');
        mediator.sub('chat:data', function (data) {
            $scope.$apply(function () {
                $scope.data = data.dialogs.map(function (dialog) {
                    var messageAuthorId = dialog.messages[0].uid, result = {};

                    if ((dialog.chat_id || dialog.uid !== messageAuthorId)) {
                        result.author = _(dialog.profiles).findWhere({
                            uid: messageAuthorId
                        });
                    }
                    if (dialog.chat_id) {
                        result.owners = dialog.profiles;
                    } else {
                        result.owners = _(dialog.profiles).findWhere({
                            uid: dialog.uid
                        });
                    }

                    result.messages = dialog.messages;

                    return result;
                });
            });
        }.bind(this));
    });


define(['i18n/i18n'], function (I18N) {
    var i18n = new I18N();

    i18n.decl('chat', {
        'ru': 'Диалоги',
        'en': 'Chat'
    });
    i18n.decl('updates', {
        'ru': 'Обновления',
        'en': 'Updates'
    });
    i18n.decl('buddies', {
        'ru': 'Люди',
        'en': 'Buddies'
    });

    return i18n;
});

define(['jtoh', 'app/i18n'], function (jtoh, i18n) {
    return [
        {className: 'navbar navbar-inverse navbar-static-top', innerHTML: {
            className: 'navbar-inner',
            innerHTML: {className: 'container', innerHTML: [
                // {className: 'brand', tagName: 'a', attributes: {href: '#'}, innerHTML: 'VKfox'},
                {className: 'nav', tagName: 'ul', innerHTML: [
                    {tagName: 'li', innerHTML: {
                        tagName: 'a',
                        attributes: {href: '#t-app__chat-pane'},
                        innerHTML: i18n('chat')
                    }},
                    {className: 'active', tagName: 'li', innerHTML: {
                        tagName: 'a',
                        attributes: {href: '#t-app__updates-pane'},
                        innerHTML: i18n('updates')
                    }},
                    {tagName: 'li', innerHTML: {
                        tagName: 'a',
                        attributes: {href: '#t-app__buddies-pane'},
                        innerHTML: i18n('buddies')
                    }}
                ]}
            ]}
        }},
        {
            className: 'tab-content t-app__content',
            innerHTML: [
                {className: 'tab-pane t-item-list', id: 't-app__chat-pane'},
                {className: 'tab-pane active', id: 't-app__updates-pane'},
                {className: 'tab-pane', id: 't-app__buddies-pane'}
            ]
        }
    ];
});

define([
    'jtoh',
    'backbone',
    'app/tpl',
    'chat/view',
    'updates/view',
    'buddies/view',
    'common/common',
    'jquery',
    'mediator/mediator',
    'jquery.tooltip',
    'jquery.typeahead',
    'jquery.tab'
], function (
    jtoh,
    Backbone,
    template,
    ChatView,
    UpdatesView,
    BuddiesView,
    common,
    jQuery,
    Mediator
) {
    return Backbone.View.extend({
        el: document.body,
        template: jtoh(template).build(),
        // events: {
            // 'click [href]': function (e) {
                // common.openTab(jQuery(e.currentTarget).attr('href'));
            // }
        // },
        initialize: function () {
            var newsfeedView, feedbackView,
                chatView, buddiesView, updatesView;

            this.$el.append(this.template);

            this.$el.find('.nav a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
            });

            jQuery(this.$el).tooltip({
                selector: '[rel=tooltip]',
                html: false
            });
            Mediator.pub('app:view');
            Mediator.sub('app:data', function (data) {
                chatView = new ChatView({
                    el: this.$el.find('#t-app__chat-pane')
                });
                updatesView = new UpdatesView({
                    el: this.$el.find('#t-app__updates-pane')
                });
                buddiesView = new BuddiesView({
                    el: this.$el.find('#t-app__buddies-pane')
                });
            }.bind(this));
        }
    });
});

define(['i18n/i18n'], function (I18N) {
    var i18n = new I18N();

    i18n.decl('watch-online-status', {
        'ru': 'Следить за сменой статуса online',
        'en': 'Notify about online status changed'
    });
    i18n.decl('favourite', {
        'ru': 'В избранное',
        'en': 'Favourite'
    });
    i18n.decl('watch', {
        'ru': 'Следить',
        'en': 'Watch'
    });
    i18n.decl('filter', {
        'ru': 'Фильтр',
        'en': 'Filter'
    });
    i18n.decl('offline', {
        'ru': 'не в сети',
        'en': 'offline'
    });
    i18n.decl('male', {
        'ru': 'мужчины',
        'en': 'male'
    });
    i18n.decl('female', {
        'ru': 'женщины',
        'en': 'male'
    });

    return i18n;
});

define([
    'jtoh',
    'jquery',
    'item/tpl',
    'buddies/i18n'
], function (jtoh, jQuery, itemTemplate, i18n) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    tpl.attributes['data-uid'] = function (data) {
        return data.uid;
    };
    tpl.className.push(function (data) {
        var classTokens = [' t-buddies__item'];

        if (data.online) {
            classTokens.push('is-online');
        }
        if (data.favourite) {
            classTokens.push('is-favourite');
        }
        if (data.watched) {
            classTokens.push('is-watched');
        }
        return classTokens.join(' ');
    });
    jtoh(tpl).getElementsByClassName('t-item__img')[0].attributes.src = function (data) {
        return data.photo;
    };
    jtoh(tpl).getElementsByClassName('t-item__author')[0].innerHTML = function (data) {
        return [data.first_name, data.last_name].join(' ');
    };
    jtoh(tpl).getElementsByClassName('t-item__actions')[0].innerHTML = (function () {
        var elements = [
            {name: 'toggle-watch', icon: 'icon-eye-open', title: i18n('watch-online-status')},
            {name: 'toggle-favourite', icon: 'icon-star', title: i18n('favourite')}
        ];

        return elements.map(function (element) {
            return {
                tagName: 'i',
                attributes: {
                    title: element.title,
                    class: 't-item__action t-buddies__' + element.name + ' ' + element.icon
                }
            };
        });
    }());
    return tpl;
});

define([
    'jtoh',
    'mediator/mediator',
    'item/view',
    'buddies/item/tpl',
    'jquery.tooltip'
], function (jtoh, Mediator, ItemView, template) {
    return ItemView.extend({
        events: {
            'click .t-buddies__toggle-watch': function (e) {
                this.$el.toggleClass('is-watched');
                Mediator.pub('buddies:watched:toggle', this.$el.data('uid'));
            },
            'click .t-buddies__toggle-favourite': function (e) {
                this.$el.toggleClass('is-favourite');
                Mediator.pub('buddies:favourite:toggle', this.$el.data('uid'));
            }
        },
        template: jtoh(template).compile(),
        initialize: function () {
            ItemView.prototype.initialize.apply(this, arguments);
        }
    });
});

define(['jtoh', 'buddies/i18n'], function (jtoh, i18n) {
    return [
        {className: 'navbar navbar-static-top', innerHTML: {
            className: 'navbar-inner form-inline navbar-form t-buddies__controls',
            tagName: 'form',
            innerHTML: [
                {
                    className: 'input-append',
                    innerHTML: [
                        {tagName: 'input', attributes: {
                            type: 'text',
                            placeholder: 'http://vk.com/durov',
                            class: 'span2 t-buddies__add-fav-input'
                        }},
                        {tagName: 'button', attributes: {
                            class: 'btn t-buddies__add-fav-button',
                            type: 'button'
                            // TODO I18N
                        }, innerHTML: i18n('watch')},
                    ]
                },
                {
                    className: 'btn-group pull-right',
                    attributes: {'data-toggle': 'buttons-checkbox'},
                    innerHTML: [
                        {
                            tagName: 'button',
                            className: 'btn dropdown-toggle',
                            attributes: {'data-toggle': 'dropdown', type: 'button'},
                            innerHTML: [
                                // i18n('filter'), ' ',
                                {tagName: 'i', className: 'icon-align-justify'}, ' ',
                                {className: 'caret'}
                            ]
                        },
                        {
                            tagName: 'ul',
                            className: 'dropdown-menu t-buddies__dropdown',
                            innerHTML: function (data) {
                                return Object.keys(data).map(function (checkboxName) {
                                    return {tagName: 'li', innerHTML: { tagName: 'a', innerHTML: {
                                        tagName: 'label',
                                        className: 'checkbox t-buddies__dropdown-label',
                                        innerHTML: [
                                            {
                                                tagName: 'input',
                                                attributes: {
                                                    name: checkboxName,
                                                    checked: data[checkboxName] ? 'checked':undefined,
                                                    class: 't-buddies__dropdown-checkbox',
                                                    type: 'checkbox',
                                                }
                                            },
                                            i18n(checkboxName)
                                        ]
                                    }}};
                                });
                            }
                        }
                    ]
                }
            ]
        }},
        {className: 't-item-list'}
    ];
});

define([
    'underscore',
    'backbone',
    'jtoh',
    'mediator/mediator',
    'request/request',
    'buddies/tpl',
    'buddies/item/view',
    'storage/model',
    'jquery.dropdown'
], function (
    _,
    Backbone,
    jtoh,
    Mediator,
    request,
    template,
    ItemView,
    StorageModel
) {
    return Backbone.View.extend({
        template: jtoh(template),
        model: new Backbone.Model({
            itemsViews : new Backbone.Collection(),
            filters: new StorageModel({
                offline: true,
                male: true,
                female: true
            }, {name: 'buddies.filters'})
        }),
        events: {
            // prevent form from submiting
            'submit .t-buddies__controls': function (e) {
                return false;
            },
            'click .t-buddies__dropdown-checkbox': function (e) {
                var target = e.target;

                this.model.get('filters').set(target.name, target.checked);
                this.model.get('itemsViews').reset();

                this.$el.find('.t-buddies__item-list').empty();
                Mediator.pub('buddies:data:get');
            },
            'click .t-buddies__add-fav-button': 'addFavouriteBuddie',
            'keypress .t-buddies__add-fav-input': function (e) {
                if (e.keyCode === 13) {
                    this.addFavouriteBuddie();
                }
            }
        },
        initialize: function () {
            this.$el.append(this.template.build(this.model.get('filters').toJSON()));

            Mediator.pub('buddies:data:get');
            Mediator.sub('buddies:data', function (buddies) {
                this.renderBuddies(buddies);
            }.bind(this));
        },
        addFavouriteBuddie: function () {
            var screenName,
                input = this.$el.find('.t-buddies__add-fav-input'),
                value = input.val();

            input.val('');
            try {
                screenName = value.match(/vk\.com\/([\w_]+)/)[1];
            } catch (e) {}

            request.api({
                code: 'return API.resolveScreenName({screen_name: "' + screenName + '"});'
            }).done(function (response) {
                var uid;
                if (response.type === 'user') {
                    uid = response.object_id;
                    Mediator.pub('buddies:favourite:toggle', uid);
                    // } else {
                        // FIXME
                }
            });
        },
        renderBuddies: function (buddies) {
            var self = this,
                fragment = document.createDocumentFragment();

            buddies.filter(this.filterBuddy, this).forEach(function (buddie) {
                var view = self.model.get('itemsViews').get(buddie.uid);

                if (view) {
                    view.get('view').model.set(buddie);
                    view.get('view').$el.appendTo(fragment);
                } else {
                    self.model.get('itemsViews').add({
                        id: buddie.uid,
                        view: new ItemView({
                            el: fragment,
                            model: new Backbone.Model(buddie)
                        })
                    });
                }
            });
            this.$el.find('.t-item-list').prepend(fragment);
        },
        /**
         * Filters buddie according to selected filters
         *
         * @param {Object} buddie
         * @return {Boolean}
         */
        filterBuddy: function (buddie) {
            var filters = this.model.get('filters');

            return (filters.get('offline') || buddie.online)
                && ((filters.get('male') && buddie.sex === 2)
                || (filters.get('female') && buddie.sex === 1));
        }
    });
});

define(['i18n/i18n'], function (I18N) {
    var i18n = new I18N();

    i18n.decl('private-message', {
        'ru': 'Приватное сообщение',
        'en': 'Private message'
    });

    return i18n;
});

define(['backbone'], function (Backbone) {
    return Backbone.Model.extend({
        initialize: function (model) {
            this.set('profiles', new (Backbone.Collection.extend({
                model: Backbone.Model.extend({
                    idAttribute: 'uid'
                })
            }))(model.profiles));
        }
    });
});

define([
    'jtoh',
    'jquery',
    'item/tpl',
    'item/__attachment.tpl',
    'chat/i18n'
], function (jtoh, jQuery, itemTemplate, attachmentTemplate, i18n) {
    var tpl = jQuery.extend(true, {}, itemTemplate),
        avatar = jtoh(tpl).getElementsByClassName('t-item__img')[0],
        content = jtoh(tpl).getElementsByClassName('t-item__content')[0];

    avatar.attributes.src = function (data) {
        if (!data.chat_id) {
            return data.profiles.get(data.uid).get('photo');
        }
    };
    avatar.tagName = function (data) {
        return !data.chat_id ? 'img':'div';
    };
    avatar.innerHTML = function (data) {
        if (data.chat_id) {
            return [
                {tagName: 'i', className: 'icon-user'},
                data.profiles.length
            ];
        }
    };

    tpl.className.push([' t-chat__item ', function (data) {
        if (!data.chat_id) {
            return data.profiles.at(0).get('online') ? 'is-online':undefined;
        }
    }]);
    tpl.attributes['data-chat-id'] = function (data) {
        return data.chat_id;
    };
    tpl.attributes['data-uid'] = function (data) {
        return data.uid;
    };
    jtoh(tpl).getElementsByClassName('t-item__author')[0].innerHTML = function (data) {
        var profiles;

        if (!data.chat_id) {
            profiles = [data.profiles.get(data.uid).toJSON()];
        } else {
            profiles = data.profiles.toJSON();
        }
        return profiles.map(function (profile) {
            return [profile.first_name, profile.last_name].join(' ');
        }).join(', ');
    };
    content.tagName = 'blockquote';
    content.innerHTML = [
        {
            tagName: 'p',
            innerHTML: function (data) {
                return data.messages.map(function (message, i) {
                    // TODO attachments
                    var content = [message.body];
                    if (i < data.messages.length - 1) {
                        content.push('</br>');
                    }
                    return content;
                });
            }
        },
        function (data) {
            var senderUid = data.messages[0].uid,
                senderProfile;

            if ((data.chat_id || data.uid !== senderUid)) {
                senderProfile = data.profiles.get(senderUid);

                return {tagName: 'small', innerHTML: [
                    senderProfile.get('first_name'), senderProfile.get('last_name')
                ].join(' ')};
            }
        }
    ];
    content.className.push(function (data) {
        if (data.messages[0].uid !== data.uid) {
            return ' pull-right';
        }
    });
    jtoh(tpl).getElementsByClassName('t-item__actions')[0].innerHTML = (function () {
        var elements = [
            {name: 'toggle-message', icon: 'icon-envelope', title: i18n('private-message')}
        ];

        return elements.map(function (element) {
            return {
                tagName: 'i',
                attributes: {
                    title: element.title,
                    class: 't-item__action t-chat__' + element.name + ' ' + element.icon
                }
            };
        });
    }());
    return tpl;
});

define([
    'underscore',
    'backbone',
    'jtoh',
    'mediator/mediator',
    'item/view',
    'chat/item/tpl',
    'request/request',
    'chat/i18n',
    'jquery.dropdown'
], function (_, Backbone, jtoh, Mediator, ItemView, template, request, i18n) {
    return ItemView.extend({
        events: {
            'click .t-chat__toggle-message, .t-chat__item .t-item__content': function (e) {
                var item = jQuery(e.target).parents('.t-item'),
                uid = item.data('uid'),
                chatId = item.data('chat-id');

                if (typeof uid !== 'undefined') {
                    this.toggleReply(item, function (value) {
                        var params = {
                            message: jQuery.trim(value)
                        };
                        this.value = '';

                        if (chatId) {
                            params.chat_id = chatId;
                        } else {
                            params.uid = uid;
                        }

                        request.api({
                            code: 'return API.messages.send(' + JSON.stringify(params) + ');'
                        });
                        // TODO locale
                    }, i18n('private-message'));
                }
            }
        },
        template: jtoh(template).compile(),
        initialize: function () {
            var self = this;
            this.model.on('change:messages', function () {
                self.$el.find('.t-item__content').replaceWith(jtoh(
                    jtoh(template).getElementsByClassName('.t-item__content')[0]
                ).build(self.model.toJSON()));
            });
            ItemView.prototype.initialize.apply(this, arguments);
        }
    });
});

define(['jtoh'], function (jtoh) {
    return [
        {className: 'navbar navbar-static-top', innerHTML: {className: 'navbar-inner', innerHTML: {
            tagName: 'form',
            className: 'navbar-form',
            innerHTML: [
                {tagName: 'input', attributes: {
                    type: 'text',
                    placeholder: 'Search...',
                    class: 'search-form span2 typeahead'
                }},
                {
                    className: 'btn-group pull-right',
                    attributes: {'data-toggle': 'buttons-checkbox'},
                    innerHTML: [
                        // {tagName: 'button', attributes: {type: 'button'}, className: 'btn', innerHTML: '&#9794;'},
                        // {tagName: 'button', attributes: {type: 'button'}, className: 'btn', innerHTML: '&#9792;'},
                        // {tagName: 'button', attributes: {type: 'button'}, className: 'btn', innerHTML: '1'},
                        {
                            tagName: 'button',
                            className: 'btn dropdown-toggle',
                            attributes: {'data-toggle': 'dropdown', type: 'button'},
                            innerHTML: [
                                {tagName: 'i', className: 'icon-align-justify'}, ' ',
                                {className: 'caret'}
                            ]
                        },
                        {
                            tagName: 'ul',
                            className: 'dropdown-menu',
                            innerHTML: [
                                {tagName: 'li', innerHTML: {
                                    tagName: 'label',
                                    className: 'checkbox',
                                    innerHTML: 'zzz'
                                }}
                            ]
                        }
                    ]
                }
            ]
        }}},
        {className: 't-item-list '}
    ];
});

define([
    'underscore',
    'backbone',
    'jtoh',
    'mediator/mediator',
    'request/request',
    'chat/item/view',
    'chat/item/model',
    'jquery.dropdown'
], function (
    _,
    Backbone,
    jtoh,
    Mediator,
    request,
    ItemView,
    ItemModel
) {
    return Backbone.View.extend({
        model: new Backbone.Model({
            itemsViews : new (Backbone.Collection.extend({
                comparator: function (itemView) {
                    var messages = itemView.get('view').model.get('messages');
                    return - messages[messages.length - 1].date;
                }
            }))()
        }),
        events: {
            'click .t-item__action--message, .t-item__content': function (e) {
                var item = jQuery(e.target).parents('.t-item'),
                    uid = item.data('owner-id'),
                    chat_id = item.data('chat-id');

                if (typeof uid !== 'undefined') {
                    ItemView.toggleReply(item, function (value) {
                        var params = {
                            message: jQuery.trim(value)
                        };
                        this.value = '';

                        if (chat_id) {
                            params.chat_id = chat_id;
                        } else {
                            params.uid = uid;
                        }

                        request.api({
                            code: 'return API.messages.send(' + JSON.stringify(params) + ');'
                        });
                        // TODO locale
                    }, 'Private message');
                }
            }
        },
        initialize: function () {
            Mediator.pub('chat:view');
            Mediator.sub('chat:data', function (data) {
                this.renderDialogs(data.dialogs);
            }.bind(this));
        },
        renderDialogs: function (dialogs) {
            var self = this,
                fragment = document.createDocumentFragment();

            dialogs.forEach(function (dialog) {
                var view = self.model.get('itemsViews').get(dialog.id);

                if (view) {
                    view.get('view').model.set(new ItemModel(dialog).toJSON());
                    view.get('view').$el.appendTo(fragment);
                } else {
                    self.model.get('itemsViews').add({
                        id: dialog.id,
                        view: new ItemView({
                            el: fragment,
                            model: new ItemModel(dialog)
                        })
                    });
                }
            });
            this.$el.prepend(fragment);
        }
    });
});

define(['config/config'], function (config) {
    return {
        addVkBase: function (url) {
            if ((url) && (url.substr(0, 4) !== 'http') && (url.substr(0, 4) !== 'www.')) {
                if (url.charAt(0) === '/') {
                    url = 'http://' + config.vk.domain + url;
                } else {
                    url = 'http://' + config.vk.domain + '/' + url;
                }
            }
            return url;
        },
        openTab: function (url) {
            chrome.tabs.create({
                "url": url
            });
        }
    };
});

angular.module('config', [])
    .constant('VK_BASE', 'vk.com');

define([
    'jtoh',
    'jquery',
    'item/tpl',
    'item/__attachment.tpl'
], function (jtoh, jQuery, itemTemplate, attachmentTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);

    jtoh(tpl).getElementsByClassName('t-item__img')[0].attributes.src = function (data) {
        return data.owners[0].photo;
    };
    jtoh(tpl).getElementsByClassName('t-item__author')[0].innerHTML = function (data) {
        var author = data.owners[0];
        return author.id > 0 ? [author.first_name, author.last_name].join(' '):author.name;
    };
    jtoh(tpl).getElementsByClassName('t-item__content')[0].innerHTML = function (data) {
        var attachment = {};

        switch (data.type) {
        case 'photo':
        case 'video':
            attachment.type = data.type;
            attachment[data.type] = data.parent;
            return attachmentTemplate(attachment);
        case 'topic':
            return data.parent.title;
        case 'post':
        case 'comment':
            return [
                data.parent.text,
                (data.parent.attachments || []).map(attachmentTemplate)
            ];
        }
    };

    return tpl;
});

define([
    'underscore',
    'backbone',
    'jtoh',
    'mediator/mediator',
    'item/view',
    'feedback/item/tpl',
], function (_, Backbone, jtoh, Mediator, ItemView, template) {
    return ItemView.extend({
        template: jtoh(template).compile(),
        initialize: function () {
            var self = this;

            if (this.model.get('feedbacks')) {
                this.model.on('change:feedbacks', function () {});
            }
            ItemView.prototype.initialize.apply(this, arguments);
        }
    });
});

define([
    'underscore',
    'backbone',
    'jtoh',
    'mediator/mediator',
    'feedback/item/view',
    // 'item/post.view',
    // 'item/friend.tpl',
    // 'item/comment.tpl',
    // 'item/copy.tpl',
    // 'item/like.tpl',
    // 'item/photo.tpl',
    // 'item/topic.tpl',
    // 'item/follow.tpl',
    // 'item/video.tpl'
], function (
    _,
    Backbone,
    jtoh,
    Mediator,
    ItemView
    // ItemPostView,
    // friendTemplate,
    // commentTemplate,
    // copyTemplate,
    // likeTemplate,
    // photoTemplate,
    // topicTemplate,
    // followTemplate,
    // videoTemplate
) {
    return Backbone.View.extend({
        model: new Backbone.Model({
            // groups: new (Backbone.Collection.extend({
                // model: Backbone.Model.extend({
                    // idAttribute: 'gid'
                // })
            // }))(),
            // profiles: new (Backbone.Collection.extend({
                // model: Backbone.Model.extend({
                    // idAttribute: 'uid'
                // })
            // }))(),
            items : new Backbone.Collection()
        }),
        initialize: function () {
            this.model.get('items').on('reset', this.render.bind(this));

            Mediator.pub('feedback:view');
            Mediator.sub('feedback:data', function (data) {
                this.render(data.items);
            }.bind(this));
        },
        render: function (items) {
            items.forEach(function (item) {
                var view = new ItemView({
                    el: this.$el,
                    model: new Backbone.Model(item)
                });
            }, this);
        },
        // TODO use documentfragment split into three functions
        // render: function () {
            // this.model.get('items').slice(1).reverse().forEach(function (item) {
                // var itemView, type = item.get('type'), View,
                    // parent = item.get('parent'), $parent,
                    // feedback = item.get('feedback');

                // if (['comment_post', 'like_post', 'copy_post'].indexOf(type) !== -1) {
                    // $parent = this.$el.find([
                        // '.item[data-owner-id=',
                        // parent.from_id,
                        // '][data-pid=',
                        // parent.id,
                        // ']'
                    // ].join(''));

                    // if (!$parent.length) {
                        // $parent = this.renderPost({parent: this.el, item: parent}).$el;
                    // }

                    // switch (type) {
                    // case 'comment_post':
                        // this.renderComment({parent: $parent, item: feedback});
                        // break;
                    // case 'like_post':
                        // this.renderLikes({parent: $parent, item: feedback});
                        // break;
                    // case 'copy_post':
                        // this.renderCopies({parent: $parent, item: feedback});
                        // break;
                    // }
                // } else if (['reply_comment', 'like_comment'].indexOf(type) !== -1) {
                    // $parent = this.$el.find([
                        // '.item[data-owner-id=',
                        // parent.owner_id,
                        // '][data-cid=',
                        // parent.id,
                        // ']'
                    // ].join(''));

                    // if (!$parent.length) {
                        // $parent = this.renderComment({parent: this.el, item: parent}).$el;
                    // }

                    // switch (type) {
                    // case 'like_comment':
                        // this.renderLikes({parent: $parent, item: feedback});
                        // break;
                    // case 'reply_comment':
                        // this.renderComment({parent: $parent, item: feedback});
                        // break;
                    // }
                // } else if (['comment_video', 'like_video', 'copy_video'].indexOf(type) !== -1) {
                    // $parent = this.$el.find([
                        // '.item[data-owner-id=',
                        // parent.owner_id,
                        // '][data-vid=',
                        // parent.id,
                        // ']'
                    // ].join(''));

                    // if (!$parent.length) {
                        // $parent = this.renderItem({
                            // parent: this.el,
                            // item: parent,
                            // template: jtoh(videoTemplate).compile()
                        // }).$el;
                    // }

                    // switch (type) {
                    // case 'comment_video':
                        // this.renderComment({parent: $parent, item: feedback});
                        // break;
                    // case 'like_video':
                        // this.renderLikes({parent: $parent, item: feedback});
                        // break;
                    // case 'copy_video':
                        // this.renderCopies({parent: $parent, item: feedback});
                        // break;
                    // }
                // } else if (['comment_photo', 'like_photo', 'copy_photo'].indexOf(type) !== -1) {
                    // $parent = this.$el.find([
                        // '.item[data-owner-id=',
                        // parent.owner_id,
                        // '][data-photo-id=',
                        // parent.pid,
                        // ']'
                    // ].join(''));

                    // if (!$parent.length) {
                        // $parent = this.renderItem({
                            // parent: this.el,
                            // item: parent,
                            // template: jtoh(photoTemplate).compile()
                        // }).$el;
                    // }

                    // switch (type) {
                    // case 'comment_photo':
                        // this.renderComment({parent: $parent, item: feedback});
                        // break;
                    // case 'like_photo':
                        // this.renderLikes({parent: $parent, item: feedback});
                        // break;
                    // case 'copy_photo':
                        // this.renderCopies({parent: $parent, item: feedback});
                        // break;
                    // }

                // } else if (type === 'reply_topic') {
                    // $parent = this.$el.find([
                        // '.item[data-owner-id=',
                        // parent.owner_id,
                        // '][data-tid=',
                        // parent.id,
                        // ']'
                    // ].join(''));

                    // if (!$parent.length) {
                        // $parent = this.renderItem({
                            // parent: this.el,
                            // item: parent,
                            // template: jtoh(topicTemplate).compile()
                        // }).$el;

                    // }
                    // this.renderComment({parent: $parent, item: feedback});

                // } else {
                    // switch (type) {
                    // case 'wall':
                        // this.renderPost({parent: this.el, item: feedback});
                        // break;
                    // case 'mention':
                        // this.renderPost({parent: this.el, item: feedback});
                        // break;
                    // case 'follow':
                        // // TODO make profiles field for followers
                        // return;
                        // new (ItemView.extend({
                            // // TODO cache compiled
                            // template: jtoh(followTemplate).compile()
                        // }))({
                            // el: this.el,
                            // model: new Backbone.Model({
                                // profile: this.model.get('profiles').get(ownerId).toJSON(),
                                // profiles: [].concat(feedback).map(function (follower) {
                                    // return follower.owner_id;
                                // }, this)
                            // })
                        // })
                        // break;
                    // }
                // }
            // }, this);
        // },
        renderPost: function (data) {
            var profile, group, ownerId = data.item.owner_id || data.item.from_id;

            if (ownerId > 0) {
                profile = this.model.get('profiles').get(ownerId).toJSON();
            } else {
                group = this.model.get('groups').get(- ownerId).toJSON();
            }

            return new ItemPostView({
                el: data.parent,
                model: new Backbone.Model({
                    item: data.item,
                    profile: profile,
                    group: group
                })
            });
        },
        renderItem: function (data) {
            var
            View = ItemView.extend({
                // TODO cache compiled
                template: data.template
            }), view;

            ([].concat(data.item)).forEach(function (item) {
                var profile, group;
                if (item.owner_id > 0) {
                    profile = this.model.get('profiles').get(item.owner_id).toJSON();
                } else {
                    group = this.model.get('groups').get(-item.owner_id).toJSON();
                }

                view = new View({
                    el: data.parent,
                    model: new Backbone.Model({
                        item: item,
                        profile: profile,
                        group: group
                    })
                });
            }, this);
            return view;
        },
        renderComment: function (data) {
            return this.renderItem(_.extend(data, {
                template: jtoh(commentTemplate).compile()
            }));
        },
        renderLikes: function (data) {
            return this.renderItem(_.extend(data, {
                template: jtoh(likeTemplate).compile()
            }));
        },
        renderCopies: function (data) {
            return this.renderItem(_.extend(data, {
                template: jtoh(copyTemplate).compile()
            }));
        }
    });
});

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

define(function () {
    var lang = window.navigator.language.match(/(ru)|(en)/)[1] || 'ru';

    function factory() {
        var store = {};

        function i18n(key, data) {
            var translation;
            try {
                translation = store[key][lang];
            } catch (e) {
                throw new Error('Undefined keyset: ' + lang + ' ' + key);
            }

            if (typeof translation === 'function') {
                return translation(data);
            } else {
                return translation;
            }
        }
        i18n.decl = function (key, translations) {
            store[key] = translations;
        };
        return i18n;
    }
    return factory;
});

define(['item/__attachments.tpl'], function (attachmentsTemplate) {
    return [
        function (data) {
            var item = data.item;

            return item.text;
        },
        attachmentsTemplate
    ];
});

define(['jtoh', 'jquery', 'item/tpl'], function (jtoh, jQuery, itemTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    tpl.attributes['data-cid'] = function (data) {
        return data.item.id;
    };
    jtoh(tpl).getElementsByClassName('item-content')[0].innerHTML = function (data) {
        var item = data.item;
        return item.text;
    };

    return tpl;
});

define(['jtoh', 'jquery', 'item/tpl'], function (jtoh, jQuery, itemTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    jtoh(tpl).getElementsByClassName('item-content')[0].innerHTML = function (data) {
        return {tagName: 'i', className: 'icon-share-alt'};
    };
    jtoh(tpl).getElementsByClassName('item-header')[0].innerHTML.shift();

    return tpl;
});

define(['jtoh', 'jquery', 'item/tpl'], function (jtoh, jQuery, itemTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    jtoh(tpl).getElementsByClassName('item-content')[0].innerHTML = [
        // TODO localize
        function (data) {
            return [
                'Новых подписчиков: ', data.count,
                {innerHTML: data.profiles.map(function (profile) {
                    return {tagName: 'a',
                        attributes: {
                            href: '#',
                            rel: 'tooltip',
                            title: [profile.get('first_name'), profile.get('last_name')].join(' ')
                        },
                        innerHTML: {tagName: 'img', attributes: {class: 'avatar', src: profile.get('photo')}}
                    };
                })}
            ];
        }
    ];
    return tpl;
});

define(['jtoh', 'jquery', 'item/tpl'], function (jtoh, jQuery, itemTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    jtoh(tpl).getElementsByClassName('item-content')[0].innerHTML = [
        // TODO localize
        function (data) {
            return [
                'Новых друзей: ', data.count,
                {innerHTML: data.profiles.map(function (profile) {
                    return {tagName: 'a',
                        attributes: {
                            href: '#',
                            rel: 'tooltip',
                            title: [profile.get('first_name'), profile.get('last_name')].join(' ')
                        },
                        innerHTML: {tagName: 'img', attributes: {class: 'avatar', src: profile.get('photo')}}
                    };
                })}
            ];
        }
    ];
    return tpl;
});

angular.module('item', ['filters'])
    .controller('ItemController', function ($scope) {
        $scope.$watch('owners', function () {
            var owners = [].concat($scope.owners);

            if (owners.length === 1) {
                $scope.owner = owners[0];
            }
        });
    })
    .directive('item', function factory() {
        return {
            controller: 'ItemController',
            templateUrl: '/modules/popup/item/item.tmpl.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                owners: '=owners',
                class: '@class'
            }
        };
    })
    .directive('attachment', function factory() {
        return {
            templateUrl: '/modules/popup/item/attachment.tmpl.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                type: '@type',
                data: '=data'
            }
        };
    });



define(['jtoh', 'jquery', 'item/tpl'], function (jtoh, jQuery, itemTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    jtoh(tpl).getElementsByClassName('item-content')[0].innerHTML = function (data) {
        return {tagName: 'i', className: 'icon-heart'};
    };

    return tpl;
});

define(['jtoh', 'jquery', 'item/tpl', 'common/common'], function (jtoh, jQuery, itemTemplate, common) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    jtoh(tpl).getElementsByClassName('item-content')[0].innerHTML = function (data) {
        return [
            // TODO locale
            'Новых фотографий: ', data.item.photos[0],
            {innerHTML: data.item.photos.slice(1).map(function (photo) {
                return { tagName: 'img', className: 'img-polaroid', attributes: {src: common.addVkBase(photo.src_big)}};
            })}
        ];
    };
    return tpl;
});

define(['jtoh', 'jquery', 'item/tpl'], function (jtoh, jQuery, itemTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    jtoh(tpl).getElementsByClassName('item-content')[0].innerHTML = [
        function (data) {
            return data.item.notes.slice(1).map(function (note) {
                var mid = note.owner_id + '_' + note.nid,
                    url = '/note' + mid;
                return {innerHTML: [
                    {tagName: 'a', attributes: {href: url}, innerHTML: [
                        ' ', {tagName: 'i', className: 'icon-file'}, ' ', note.title
                    ]},
                    note.ncom ? [
                        ' ', {tagName: 'i', className: 'icon-comment'}, ' ', note.ncom
                    ]:undefined
                ]};
            });
        }
    ];
    return tpl;
});

define(['backbone', 'jtoh', 'item/view', 'item/note.tpl'], function (Backbone, jtoh, ItemView, noteTemplate) {
    return ItemView.extend({
        template: jtoh(noteTemplate).compile(),
    });
});

define(['jtoh', 'jquery', 'item/tpl', 'common/common'], function (jtoh, jQuery, itemTemplate, common) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    jtoh(tpl).getElementsByClassName('item-content')[0].innerHTML = function (data) {
        return [
            'Отметок на фотографиях: ', data.item.photo_tags[0],
            {innerHTML: data.item.photo_tags.slice(1).map(function (photo) {
                return { tagName: 'img', className: 'img-polaroid', attributes: {src: common.addVkBase(photo.src_big)}};
            })}
        ];
    };
    return tpl;
});

define(['jtoh', 'jquery', 'item/tpl', 'item/attachments'], function (jtoh, jQuery, itemTemplate, attachmentsTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    tpl.attributes['data-photo-id'] = function (data) {
        return data.item.pid;
    };

    jtoh(tpl).getElementsByClassName('item-content')[0].innerHTML = function (data) {
        data.item = {attachments: [{
            type: 'photo',
            photo: data.item
        }]};
        return attachmentsTemplate;
    };

    return tpl;
});

define(['backbone', 'jtoh', 'item/view', 'item/post.tpl'], function (Backbone, jtoh, ItemView, postTemplate) {
    return ItemView.extend({
        template: jtoh(postTemplate).compile()
    });
});

define(['jtoh', 'jquery', 'item/tpl'], function (jtoh, jQuery, itemTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    tpl.attributes['data-tid'] = function (data) {
        return data.item.id;
    };
    jtoh(tpl).getElementsByClassName('item-content')[0].innerHTML = function (data) {
        var item = data.item;
        // TODO locale
        return [
            {tagName: 'i', className: 'icon-comment'},
            'Тема:', item.title
        ];
    };

    return tpl;
});

define(['jtoh'], function (jtoh) {
    return {
        className: ['t-item media'],
        attributes: {},
        innerHTML: [
            {
                className: 'pull-left',
                innerHTML: {className: 't-item__img media-object', tagName: 'img', attributes: {}}
            },
            {className: 'media-body', innerHTML: [
                {
                    className: 't-item__author media-heading',
                    tagName: 'strong',
                    innerHTML: function (data) {
                        if (data.profile) {
                            return [data.profile.first_name, data.profile.last_name].join(' ');
                        } else {
                            return data.group.name;
                        }
                    }
                },
                {className: ['t-item__actions']},
                {className: ['t-item__content']}
            ]}
        ]
    };
});

define(['jtoh', 'jquery', 'item/tpl', 'item/attachments'], function (jtoh, jQuery, itemTemplate, attachmentsTemplate) {
    var tpl = jQuery.extend(true, {}, itemTemplate);
    tpl.attributes['data-vid'] = function (data) {
        return data.item.id;
    };

    jtoh(tpl).getElementsByClassName('item-content')[0].innerHTML = function (data) {
        data.item = {attachments: [{
            type: 'video',
            video: data.item
        }]};
        return attachmentsTemplate;
    };

    return tpl;
});

define([
    'backbone',
    'jtoh',
    'jquery',
    'item/tpl',
    'common/common'
], function (Backbone, jtoh, jQuery, template, common) {
    return Backbone.View.extend({
        toggleReply: function ($el, callback, placeholder) {
            var reply = $el.find('.t-item__reply');
            if (reply.length === 0) {
                $el.append(jtoh({
                    className: 't-item__reply',
                    innerHTML: {tagName: 'textarea', attributes: {
                        placeholder: placeholder || undefined
                    }}
                }).build()).find('textarea').focus().keypress(function (e) {
                    if (!e.ctrlKey  && e.keyCode === 13) {
                        callback.call(this, this.value);
                        e.preventDefault();
                    }
                });
            } else {
                reply.remove();
            }
        },
        initialize: function () {
            this.setElement(jQuery(this.template(this.model.toJSON())).appendTo(this.el), true);
        }
    });
});

angular.module('app').factory('mediator', function () {
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

angular.module('news', [])
    .controller('NewsController', function ($scope, $routeParams) {
        $scope.tabs = [
            {
                href: '/news/my',
                text: 'My'
            },
            {
                href: '/news/feed',
                text: 'Feed'
            }
        ];

        $scope.activeTab = $routeParams.tab;
    })
    .controller('FeedbackController', function ($scope, mediator) {
        mediator.pub('feedback:data:get');
        mediator.sub('feedback:data', function (data) {
            $scope.$apply(function () {
                $scope.data = data.items;
            });
        });
    });

define([
    'backbone',
    'jtoh',
    'mediator/mediator',
    'item/view',
    'item/post.view',
    'item/note.tpl',
    'item/friend.tpl',
    'item/new-photo.tpl',
    'item/photo-tag.tpl'
], function (
    Backbone,
    jtoh,
    Mediator,
    ItemView,
    ItemPostView,
    noteTemplate,
    friendTemplate,
    newPhotoTemplate,
    photoTagTemplate
) {
    var compiledTemplates = {
        note: jtoh(noteTemplate).compile(),
        friend: jtoh(friendTemplate).compile(),
        photo: jtoh(newPhotoTemplate).compile(),
        wall_photo: jtoh(newPhotoTemplate).compile(),
        photo_tag: jtoh(photoTagTemplate).compile()
    };

    return Backbone.View.extend({
        model: new Backbone.Model({
            groups: new (Backbone.Collection.extend({
                model: Backbone.Model.extend({
                    idAttribute: 'gid'
                })
            }))(),
            profiles: new (Backbone.Collection.extend({
                model: Backbone.Model.extend({
                    idAttribute: 'uid'
                })
            }))(),
            items : new Backbone.Collection()
        }),
        initialize: function () {
            this.model.get('items').on('reset', this.render.bind(this));

            Mediator.pub('newsfeed:view');
            Mediator.sub('newsfeed:data', function (data) {
                this.model.get('profiles').reset(data.profiles);
                this.model.get('groups').reset(data.groups);
                this.model.get('items').reset(data.items);
            }.bind(this));
        },
        render: function () {
            this.model.get('items').forEach(function (item) {
                var source_id = item.get('source_id'),
                    itemView, type = item.get('type'), View,
                    profile, group;
                // TODO for source_id < 0
                if (source_id > 0) {
                    profile = this.model.get('profiles').get(source_id).toJSON();
                } else {
                    group = this.model.get('groups').get(-source_id).toJSON();
                }
                switch (type) {
                case 'post':
                    itemView = new ItemPostView({
                        el: this.el,
                        model: new Backbone.Model({
                            profile: profile,
                            group: group,
                            item: item.toJSON()
                        })
                    });
                    break;
                case 'friend':
                    View = ItemView.extend({
                        template: compiledTemplates[type]
                    });
                    itemView = new View({
                        el: this.el,
                        model: new Backbone.Model({
                            profile: profile,
                            count: item.get('friends')[0],
                            profiles: item.get('friends').slice(1).map(function (friend) {
                                return this.model.get('profiles').get(friend.uid);
                            }, this)
                        })
                    });
                    break;
                default:
                    // TODO handle unknown type
                    View = ItemView.extend({
                        template: compiledTemplates[type]
                    });
                    itemView = new View({
                        el: this.el,
                        model: new Backbone.Model({
                            group: group,
                            profile: profile,
                            item: item.toJSON()
                        })
                    });
                    break;
                }
            }, this);
        }
    });
});

define(['mediator/mediator', 'underscore'], function (Mediator, _) {
    return {
        api: function () {
            var ajaxDeferred = new jQuery.Deferred(),
                id = _.uniqueId();

            Mediator.pub('request', {
                method: 'api',
                id: id,
                arguments: [].slice.apply(arguments)
            });
            Mediator.once('request:' + id, function (data) {
                ajaxDeferred[data.method].apply(ajaxDeferred, data.arguments);
                console.log(data.arguments);
            });

            return ajaxDeferred;
        }
    };
});


angular.module('router', [])
    .config(function ($routeProvider, $locationProvider, $compileProvider) {
        $locationProvider.html5Mode(true);

        $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);

        $routeProvider
            .when('/chat', {
                templateUrl: '/modules/popup/app/chat.tmpl.html'
            })
            .when('/buddies', {
                templateUrl: '/modules/popup/app/buddies.tmpl.html'
            })
            .when('/news', {
                redirectTo: '/news/my'
            })
            .when('/news/:tab', {
                controller: 'NewsController',
                templateUrl: '/modules/popup/news/news.tmpl.html'
            })
            .otherwise({
                redirectTo: '/news'
            });
    });


define(['backbone'], function (Backbone) {
    return Backbone.Model.extend({
        initialize: function (attributes, options) {
            var data = localStorage.getItem(options.name);

            if (data) {
                this.set(JSON.parse(data));
            } else {
                this.set(attributes);
            }
            this.name = options.name;
            this.on('change', this.save.bind(this));
        },
        save: function () {
            console.log('save');
            localStorage.setItem(this.name, JSON.stringify(this.toJSON()));
        }
    });
});

define(['i18n/i18n'], function (I18N) {
    var i18n = new I18N();

    i18n.decl('feedback', {
        'ru': 'Ответы',
        'en': 'Feedback'
    });
    i18n.decl('news', {
        'ru': 'Новости',
        'en': 'News'
    });
    i18n.decl('friends', {
        'ru': 'Друзья',
        'en': 'Friends'
    });
    i18n.decl('groups', {
        'ru': 'Группы',
        'en': 'Groups'
    });


    return i18n;
});

define(['jtoh', 'updates/i18n'], function (jtoh, i18n) {
    var tabs = ['feedback', 'friends', 'groups'];
    return [
        {className: 'navbar navbar-static-top', innerHTML: {
            className: 'navbar-inner form-inline navbar-form t-updates__controls',
            tagName: 'form',
            innerHTML: {
                attributes: {
                    class: 'btn-group',
                    'data-toggle': 'buttons-radio'
                },
                innerHTML: tabs.map(function (name) {
                    return {tagName: 'a', attributes: {
                        'data-toggle': 'tab',
                        href: '#t-updates__' + name,
                        type: 'button',
                        class: ['btn', function (tabName, data) {
                            if (data.activeTab === tabName) {
                                return ' active';
                            }
                        }.bind(this, name)],
                    }, innerHTML: i18n(name)};
                })
            }
        }},
        {
            className: 'tab-content',
            innerHTML: tabs.map(function (name) {
                return {
                    attributes: {
                        class: ['tab-pane t-item-list', function (tabName, data) {
                            if (data.activeTab === tabName) {
                                return ' active';
                            }
                        }.bind(this, name)],
                        id: 't-updates__' + name
                    }
                };
            })
        }
    ];
});

define([
    'underscore',
    'backbone',
    'jtoh',
    'updates/tpl',
    'storage/model',
    'feedback/view',
    'jquery.button'
], function (
    _,
    Backbone,
    jtoh,
    template,
    StorageModel,
    FeedbackView
) {
    return Backbone.View.extend({
        model: new StorageModel({
            activeTab: 'feedback',
        }, {name: 'updates'}),
        template: jtoh(template),
        initialize: function () {
            var self = this, feedbackView;

            this.$el.append(this.template.build(this.model.toJSON()));

            this.$el.find('.t-updates__controls').on('shown', function (e) {
                var tabName = e.target.hash.match(/__(\w+)/)[1];
                self.model.set('activeTab', tabName);
            });

            feedbackView = new FeedbackView({
                el: this.$el.find('#t-updates__feedback')
            });
        }
    });
});
