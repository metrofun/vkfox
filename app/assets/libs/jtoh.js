(function (root) {
    "use strict";

    var emptyTagNames = ['area', 'base', 'br', 'col', 'hr', 'img', 'input', 'link', 'meta', 'param'];

    function tokenizeElement(tagName, attrsTokens, innerHtmlTokens) {
        var htmlTokens;

        if (emptyTagNames.indexOf(tagName) !== -1) {
            htmlTokens = ['<', tagName, '/>'];
        } else {
            htmlTokens = ['<', tagName, '>', '</', tagName, '>'];
            htmlTokens.splice.apply(htmlTokens, [3, 0].concat(innerHtmlTokens));
        }
        htmlTokens.splice.apply(htmlTokens, [2, 0].concat(attrsTokens));
        return htmlTokens;
    }

    function precompile(template) {
        var tagNameRaw, attributes, innerHtmlTokens,
            htmlTokens, attrName, attrValRaw, attrsTokens = [];

        function attrsTokensFactory(attrName, attrValRaw) {
            var attrVal = attrValRaw.apply(this, [].slice.call(arguments, 2));
            attrVal = ('' + attrVal).replace(/"/g, '&quot;');
            return (typeof attrVal !== 'undefined') ? [' ', attrName, '="', attrVal, '"']:[];
        }

        if (Array.isArray(template)) {
            htmlTokens = [];
            template.forEach(function (template) {
                htmlTokens = htmlTokens.concat(precompile(template));
            });
        } else if (typeof template === 'object') {
            attributes = template.attributes || {};

            // TODO mutates template
            if (template.className) {
                attributes.class = template.className;
            }
            if (template.id) {
                attributes.id = template.id;
            }

            Object.keys(attributes).forEach(function (attrName) {
                attrValRaw = attributes[attrName];
                if (typeof attrValRaw === 'function') {
                    attrsTokens = attrsTokens.concat(attrsTokensFactory.bind(this, attrName, attrValRaw));
                } else {
                    attrValRaw = ('' + attrValRaw).replace(/"/g, '&quot;');
                    attrsTokens = attrsTokens.concat([' ', attrName, '="', attrValRaw, '"']);
                }
            });

            tagNameRaw = template.tagName;
            if (typeof tagNameRaw === 'function') {
                innerHtmlTokens = precompile(template.innerHTML);
                htmlTokens = [function () {
                    var tagName = tagNameRaw.apply(this, arguments);
                    return (typeof tagName !== 'undefined') ? tokenizeElement(tagName, attrsTokens, innerHtmlTokens) : [];
                }];
            } else if (typeof tagNameRaw === 'undefined') {
                htmlTokens = tokenizeElement('div', attrsTokens, precompile(template.innerHTML));
            } else {
                htmlTokens = tokenizeElement(tagNameRaw, attrsTokens, precompile(template.innerHTML));
            }
        } else if (typeof template !== 'undefined') {
            htmlTokens = [template];
        } else {
            htmlTokens = [];
        }

        return htmlTokens;
    }

    function compile(template) {
        var precompiled = precompile(template);

        return function process(precompiledOrTemplate) {
            var args = [].slice.call(arguments, 1), compiled,
                precompiled = precompile(precompiledOrTemplate);

            compiled = precompiled.map(function (strOrFunc) {
                return (typeof strOrFunc === 'function') ? process.apply(this, [strOrFunc.apply(this, args)].concat(args)):strOrFunc;
            });

            return compiled.join('');
        }.bind(this, precompiled);
    }

    function getElementsByClassName(json, needle) {
        var elementClassName, result = [], isMatched;
        if (Array.isArray(json)) {
            json.forEach(function (json) {
                result = result.concat(getElementsByClassName(json, needle));
            });
        } else if (typeof json === 'object') {
            elementClassName = ' ' + (json.className || json.attributes.class) + ' ';
            isMatched = needle.split(' ').every(function (className) {
                return elementClassName.indexOf(' ' + className + ' ') !== -1;
            });
            if (isMatched) {
                result.push(json);
            }
            if (json.innerHTML) {
                result = result.concat(getElementsByClassName(json.innerHTML, needle));
            }
        }
        return result;
    }

    function factory() {
        return function (json) {
            return {
                compile: compile.bind(this, json),
                build: function () {
                    return compile(json).apply(this, arguments);
                },
                getElementsByClassName: getElementsByClassName.bind(this, json)
            };
        };
    }

    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.jtoh = factory();
    }
})(typeof window === 'undefined' ? global:window);

// console.log(jtoh.compile({
    // tagName: function(){return 'tr'},
    // attributes: {
        // zz: 123,
        // yy: function(a) {return a + '"aaa"'}
    // },
    // innerHTML: 'uuuuu'
// })('ssssss'));
