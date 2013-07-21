/*global linkify */
angular.module(
    'rectify', ['i18n']
).filter('rectify', function ($filter) {
    var MAX_TEXT_LENGTH = 300,
        TRUNCATE_LENGTH = 200,

        label = $filter('i18n')('more...');

    jQuery('body').on('click', '.show-more', function (e) {
        var jTarget = jQuery(e.currentTarget);

        jTarget.replaceWith(linkify(jTarget.data('text')));
    });

    /**
     * Also replaces next wiki format: [id12345|Dmitrii],
     * or [club32194285|Читать прoдoлжение..]
     * with <a anchor="http://vk.com/id12345">Dmitrii</a>
     *
     * @param {String} text
     * @returns {String} html
     */
    function linkify(text) {
        return text.replace(
            /\[((?:id|club)\d+)\|([^\]"']+)\]/g,
            '<a anchor="http://vk.com/$1">$2</a>'
        );
    }

    function escapeQuotes(string) {
        var entityMap = {
            '"': '&quot;',
            "'": '&#39;'
        };

        return String(string).replace(/["']/g, function (s) {
            return entityMap[s];
        });
    }
    /**
     * Truncates long text, and add pseudo-link "show-more"
     * Also replaces next wiki format: [id12345|Dmitrii]
     * with <a anchor="http://vk.com/id12345">Dmitrii</a>
     *
     * @param {String} text
     *
     * @returns {String} html-string
     */
    return function (text) {
        var spaceIndex;

        if (text) {
            text = String(text);
            if (text.length > MAX_TEXT_LENGTH) {
                spaceIndex = text.indexOf(' ', TRUNCATE_LENGTH);

                if (spaceIndex !== -1) {
                    return  linkify(text.slice(0, spaceIndex)) + [
                        ' <span class="show-more btn btn-mini" data-text="',
                        escapeQuotes(text.slice(spaceIndex)),
                        '" type="button">', label, '</span>'
                    ].join('');
                } else {
                    return linkify(text);
                }
            } else {
                return linkify(text);
            }
        }
    };
});
