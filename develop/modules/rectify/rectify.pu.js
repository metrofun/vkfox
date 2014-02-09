var I18N = require('i18n/i18n.pu.js'),
    linkify = require('javascript-linkify'),
    jEmoji = require('jEmoji'),
    $ = require('zepto');

angular.module('app')
    .filter('rectify', function ($sanitize) {
        var MAX_TEXT_LENGTH = 300,
            TRUNCATE_LENGTH = 200,

            label = I18N.get('more...');

        $('body').on('click', '.show-more', function (e) {
            var jTarget = $(e.currentTarget);

            jTarget.replaceWith(linkifySanitizeEmoji(
                jTarget.data('text'),
                jTarget.data('emoji') === 'yes'
            ));
        });

        /**
         * Sanitize html with angular's $sanitize.
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
        function linkifySanitizeEmoji(text, hasEmoji) {
            var sanitized = $sanitize(hasEmoji ? jEmoji.unifiedToHTML(text):text),
                linkifiedText = linkify(sanitized, {
                    callback: function (text, href) {
                        return href ? '<a anchor="' + href + '">' + text + '</a>' : text;
                    }
                });

            //replace wiki layout
            return linkifiedText.replace(
                /\[((?:id|club)\d+)(?::bp-\d+_\d+)?\|([^\]]+)\]/g,
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
                        return linkifySanitizeEmoji(text.slice(0, spaceIndex), hasEmoji) + [
                            ' <span class="show-more btn rectify__button" data-text="',
                            escapeQuotes(text.slice(spaceIndex)), '" ',
                            hasEmoji ? 'data-emoji="yes" ':'',
                            'type="button">', label, '</span>'
                        ].join('');
                    } else {
                        return linkifySanitizeEmoji(text, hasEmoji);
                    }
                } else {
                    return linkifySanitizeEmoji(text, hasEmoji);
                }
            }
        };
    });
