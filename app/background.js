"use strict";
require.config({
    baseUrl: '/modules/background',
    paths: {
        jquery: '/components/jquery/jquery',
        underscore: '/components/underscore/underscore',
        jtoh: '/components/jtoh/jtoh',
        backbone: '/components/backbone/backbone'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'backbone.localStorage': {
            deps: ['backbone'],
            exports: 'Backbone'
        }
    }
});
require(['app/model'], function (AppModel) {
    var appModel = new AppModel();
});
