/**
 * Returns user's name
 *
 * @param {Object|Array} input
 *
 * @returns {String}
 */
exports.getName = function (input) {
    return [].concat(input).map(function (owner) {
        //group profile
        if (owner.name) {
            return owner.name;
            //user profile
        } else {
            return owner.first_name + ' ' + owner.last_name;
        }
    }).join(', ');
};
