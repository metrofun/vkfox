"use strict";
require.config({
    baseUrl: '/modules/popup',
    paths: {
        jquery: '/assets/libs/jquery-1.7.2.min',
        underscore: '/assets/libs/underscore-min',
        jtoh: '/assets/libs/jtoh',
        backbone: '/assets/libs/backbone'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'jsonpath': {
            exports: 'jsonPath'
        }
    }
});
window.console = chrome.extension.getBackgroundPage().console;
require(['app/app', 'newsfeed/newsfeed'], function () {
});
