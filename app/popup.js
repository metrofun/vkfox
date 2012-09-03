"use strict";
require.config({
    baseUrl: '/modules/popup',
    paths: {
        jquery: '/assets/js/jquery-1.7.2.min',
        underscore: '/assets/js/underscore-min',
        jtoh: '/assets/js/jtoh',
        backbone: '/assets/js/backbone-min'
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
require(['newsfeed/newsfeed'], function () {
});
