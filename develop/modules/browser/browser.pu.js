var _ = require('underscore')._,
    Mediator = require('mediator/mediator.js'),
    Browser = require('browser/detect.js');

if (Browser.firefox) {
    Mediator.sub('all', function () {
        extension.sendMessage([].slice.call(arguments));
    });
    extension.onMessage = function () {
        Mediator.pub.apply(Mediator, arguments);
    };
} else {
    throw "not implemented";
}

// Set up popup comminication
if (Browser.firefox) {
    module.exports = _.extend({}, {
        firefox: true
    }, Browser);
} else {
    throw "not implemented";
}
