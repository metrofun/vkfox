"use strict";
require.config({
    baseUrl: '/modules/background',
    paths: {
        jquery: '/assets/libs/jquery-1.7.2.min',
        underscore: '/assets/libs/underscore-min',
        jtoh: '/assets/libs/jtoh',
        backbone: '/assets/libs/backbone-min'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});
require(['auth/auth', 'newsfeed/newsfeed', 'updates/updates'], function () {
});
