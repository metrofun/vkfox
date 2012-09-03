define(function () {
    return {
        tagName: 'div',
        innerHTML: function (data) {
            return {
                tagName: 'span',
                innerHTML: JSON.stringify(data)
            };
        }
    };
});
