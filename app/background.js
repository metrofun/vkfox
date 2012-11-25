"use strict";
require.config({
    baseUrl: '/modules/background',
    paths: {
        jquery: '/assets/libs/jquery-1.8.2',
        underscore: '/assets/libs/underscore-min',
        jtoh: '/assets/libs/jtoh',
        backbone: '/assets/libs/backbone',
        'backbone.localStorage': '/assets/libs/backbone.localStorage-min'
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
