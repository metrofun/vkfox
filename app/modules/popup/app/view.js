define([
    'jtoh',
    'backbone',
    'app/tpl',
    'chat/view',
    // 'newsfeed/view',
    // 'feedback/view',
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
    // NewsfeedView,
    // FeedbackView,
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
                chatView, buddiesView;

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
                    el: this.$el.find('#chat')
                });

                // newsfeedView = new NewsfeedView({
                    // el: this.$el.find('#news')
                // });

                // feedbackView = new FeedbackView({
                    // el: this.$el.find('#feedback')
                // });

                buddiesView = new BuddiesView({
                    el: this.$el.find('#buddies')
                });
            }.bind(this));
        }
    });
});
