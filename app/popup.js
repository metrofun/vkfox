"use strict";
require.config({
    baseUrl: '/modules/popup',
    paths: {
        jquery: '/assets/libs/jquery-1.8.2',
        'jquery.tooltip': '/assets/frameworks/twitter-bootstrap/js/bootstrap-tooltip',
        'jquery.tab': '/assets/frameworks/twitter-bootstrap/js/bootstrap-tab',
        'jquery.typeahead': '/assets/frameworks/twitter-bootstrap/js/bootstrap-typeahead',
        'jquery.dropdown': '/assets/frameworks/twitter-bootstrap/js/bootstrap-dropdown',
        underscore: '/assets/libs/underscore-min',
        jtoh: '/assets/libs/jtoh',
        backbone: '/assets/libs/backbone',
        'backbone.localStorage': '/assets/libs/backbone.localStorage-min'
    },
    shim: {
        'jquery.tooltip': {
            deps: ['jquery']
        },
        'jquery.tab': {
            deps: ['jquery']
        },
        'jquery.typeahead': {
            deps: ['jquery']
        },
        'jquery.dropdown': {
            deps: ['jquery']
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});
require(['app/view'], function (AppView) {
    var appView = new AppView();
});
