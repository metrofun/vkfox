var Mediator = require('mediator/mediator.js'),
    _ = require('underscore')._,
    Request = require('request/request.bg.js');

console.log('likes.bg.js included');

/**
 * @param [Object] params
 * @param [String] params.action 'delete' or 'add'
 * @param [String] params.type 'post', 'comment' etc
 * @param [Number] params.owner_id
 * @param [Number] params.item_id
 */
Mediator.sub('likes:change', function (params) {
    var action = params.action;

    delete params.action;

    console.log('sub likes:change');
    Request.api({
        code: 'return API.likes.' + action + '(' + JSON.stringify(params) + ');'
    }).then(function (response) {
        console.log(response);
        Mediator.pub('likes:changed', _.extend(params, {
            likes: {
                count: response.likes,
                user_likes: action === 'delete' ? 0:1,
                can_like: action === 'delete' ? 1:0
            }
        }));
    });

});
