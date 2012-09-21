define(['jtoh', 'config/config', 'common/common'], function (jtoh, config, common) {
    return function (data) {
        var attachments = data.item.attachments;
        if (attachments) {
            return attachments.map(function (attachment) {
                // Extra wrap with div
                return {innerHTML: function () {
                    var attachmentData = attachment[attachment.type], url, mid;
                    switch (attachment.type) {
                    case 'app':
                        // TODO
                        url = 'http://' + config.vk.domain;
                        return '<img href="' + url + '" src="' + attachment.src + '"/><br/>';
                    case 'graffiti':
                        url = '/graffiti' + attachmentData.gid + '?from_id=' + attachmentData.owner_id;
                        return { tagName: 'img', className: 'img-polaroid', attributes: {
                            src: common.addVkBase(attachmentData.src_big)
                        }};
                    case 'video':
                        return [
                            {tagName: 'img', className: 'img-polaroid', attributes: {
                                src: common.addVkBase(attachmentData.image_big)
                            }},
                            {tagName: 'p', innerHTML: [
                                {tagName: 'i', className: 'icon-film'},
                                ' ', attachmentData.title
                            ]}
                        ];
                    case 'audio':
                        return {tagName: 'p', innerHTML: [
                            {tagName: 'i', className: 'icon-music'},
                            ' ', attachmentData.performer, ' - ', attachmentData.title
                        ]};
                    case 'photo':
                        // TODO description
                        mid = attachmentData.owner_id + '_' + attachmentData.pid;
                        url = '/photo' + mid;
                        return { tagName: 'img', className: 'img-polaroid', attributes: {src: common.addVkBase(attachmentData.src_big)}};
                    case 'posted_photo':
                        url = '/photos.php?act=posted&id=' + attachmentData.pid + '&oid=' + attachmentData.owner_id;
                        return {tagName: 'img', className: 'img-polaroid', attributes: {src: common.addVkBase(attachmentData.src_big)}};
                    case 'link':
                        url = attachmentData.url;
                        return {tagName: 'a', attributes: {href: url}, innerHTML: [
                            {tagName: 'i', className: 'icon-share-alt'}, ' ', url
                        ]};
                    case 'note':
                        mid = attachmentData.owner_id + '_' + attachmentData.nid;
                        url = '/note' + mid;
                        return {tagName: 'a', attributes: {href: url}, innerHTML: [
                            {tagName: 'i', className: 'icon-file'}, ' ', attachmentData.title
                        ]};
                    case 'poll':
                        // TODO
                        url = 'http://' + config.vk.domain;
                        return {tagName: 'a', attributes: {href: url}, innerHTML: [
                            {tagName: 'i', className: 'icon-list-alt'},
                            ' ', attachmentData.question
                        ]};
                    case 'doc':
                        url = attachmentData.url;
                        return {tagName: 'a', attributes: {href: url}, innerHTML: [
                            {tagName: 'i', className: 'icon-file'}, ' ', attachmentData.title
                        ]};
                    }

                }};
            });
        }
    };
});
