define([
    'backbone',
    'app/tpl',
    'newsfeed/view',
    'feedback/view',
    'common/common',
    'jquery',
    'jquery.tooltip',
    'jquery.tab'
], function (
    Backbone,
    template,
    NewsfeedView,
    FeedbackView,
    common,
    jQuery
) {
    return Backbone.View.extend({
        el: document.body,
        template: template,
        // events: {
            // 'click [href]': function (e) {
                // common.openTab(jQuery(e.currentTarget).attr('href'));
            // }
        // },
        initialize: function () {
            var newsfeedView, feedbackView;

            this.$el.append(template());

            this.$el.find('.nav a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
            });

            jQuery(this.$el).tooltip({
                selector: '[rel=tooltip]',
                html: false
            });

            newsfeedView = new NewsfeedView({
                el: this.$el.find('#news')
            });

            feedbackView = new FeedbackView({
                el: this.$el.find('#feedback')
            });
        }
    });
});
