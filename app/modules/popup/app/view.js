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
