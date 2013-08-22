/*global linkify, jEmoji*/
angular.module(
    'rectify', ['i18n']
).filter('rectify', function ($filter) {
    var MAX_TEXT_LENGTH = 300,
        TRUNCATE_LENGTH = 200,

        label = $filter('i18n')('more...');

    jQuery('body').on('click', '.show-more', function (e) {
        var jTarget = jQuery(e.currentTarget);

        jTarget.replaceWith(linkifyAndEmoji(
            jTarget.data('text'),
            jTarget.data('emoji') === 'yes'
        ));
    });

    /**
     * Replaces all links with correspndenting anchors,
     * replaces next wiki format: [id12345|Dmitrii],
     * [id12345:bp_234567_1234|Dmitrii]
     * or [club32194285|Читать прoдoлжение..]
     * with <a anchor="http://vk.com/id12345">Dmitrii</a>
     * And repaces emoji unicodes with corrspondenting images
     *
     * @param {String} text
     * @returns {String} html
     */
    function linkifyAndEmoji(text, hasEmoji) {
        var linkifiedText = linkify(text, {
            callback: function (text, href) {
                return href ? '<a anchor="' + href + '">' + text + '</a>' : text;
            }
        });

        //replace wiki layout
        linkifiedText = linkifiedText.replace(
            /\[((?:id|club)\d+)(?::bp-\d+_\d+)?\|([^\]]+)\]/g,
            '<a anchor="http://vk.com/$1">$2</a>'
        );

        return hasEmoji ? jEmoji.unifiedToHTML(linkifiedText):linkifiedText;
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
     * Replaces text links and next wiki format: [id12345|Dmitrii]
     * with <a anchor="http://vk.com/id12345">Dmitrii</a>
     * And repaces emoji unicodes with corrspondenting images
     *
     * @param {String} text
     * @param {Boolean} hasEmoji If true, then we need to replace missing unicodes with images
     *
     * @returns {String} html-string
     */
    return function (text, hasEmoji) {
        var spaceIndex;

        if (text) {
            text = String(text);
            if (text.length > MAX_TEXT_LENGTH) {
                spaceIndex = text.indexOf(' ', TRUNCATE_LENGTH);

                if (spaceIndex !== -1) {
                    return linkifyAndEmoji(text.slice(0, spaceIndex), hasEmoji) + [
                        ' <span class="show-more btn rectify__button" data-text="',
                        escapeQuotes(text.slice(spaceIndex)), '" ',
                        hasEmoji ? 'data-emoji="yes" ':'',
                        'type="button">', label, '</span>'
                    ].join('');
                } else {
                    return linkifyAndEmoji(text, hasEmoji);
                }
            } else {
                return linkifyAndEmoji(text, hasEmoji);
            }
        }
    };
});
