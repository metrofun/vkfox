"use strict";
require.config({
    baseUrl: '/modules/popup',
    paths: {
        'jquery': '/components/jquery/jquery',
        'jquery.tooltip': '/components/bootstrap/js/bootstrap-tooltip',
        'jquery.tab': '/components/bootstrap/js/bootstrap-tab',
        'jquery.typeahead': '/components/bootstrap/js/bootstrap-typeahead',
        'jquery.dropdown': '/components/bootstrap/js/bootstrap-dropdown',
        'jquery.button': '/components/bootstrap/js/bootstrap-button',
        'underscore': '/components/underscore/underscore',
        'jtoh': '/components/jtoh/jtoh',
        'backbone': '/components/backbone/backbone',
        'backbone.bemview': '/components/backbone-bemview/backbone-bemview'
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
