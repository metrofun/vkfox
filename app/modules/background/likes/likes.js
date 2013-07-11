angular.module(
    'likes',
    ['request', 'mediator']
).run(function (Request, Mediator) {
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

        console.log(params);
        Request.api({
            code: 'return API.likes.' + action + '(' + JSON.stringify(params) + ');'
        }).then(function (response) {
            Mediator.pub('likes:changed', _.extend(params, {
                likes: {
                    count: response.likes,
                    user_likes: action === 'delete' ? 0:1,
                    can_like: action === 'delete' ? 1:0
                }
            }));
        });

    });
});

