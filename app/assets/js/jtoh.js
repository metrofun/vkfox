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

        if (Array.isArray(template)) {
            htmlTokens = template.map(function (template) {
                return precompile(template);
            });
        } else if (typeof template === 'object') {
            attributes = template.attributes;

            if (template.className) {
                attributes = attributes || {};
                attributes['class'] = template.className;
            }

            for (attrName in attributes) {
                attrValRaw = attributes[attrName];
                if (typeof attrValRaw === 'function') {
                    attrsTokens = attrsTokens.concat(function(attrValRaw) {
                        var attrVal = attrValRaw.apply(this, [].slice.call(arguments, 1));
                        attrVal = ('' + attrVal).replace(/"/g, '&quot;');
                        return (typeof attrVal !== 'undefined') ? [' ', attrName, '="', attrVal, '"']:[];
                    }.bind(this, attrValRaw));
                } else {
                    attrValRaw = ('' + attrValRaw).replace(/"/g, '&quot;');
                    attrsTokens = attrsTokens.concat([' ', attrName, '="', attrValRaw, '"']);
                }
            }

            tagNameRaw = template.tagName;
            if (typeof tagNameRaw === 'function') {
                innerHtmlTokens = precompile(template.innerHTML);
                htmlTokens = [function(){
                    var tagName = tagNameRaw.apply(this, arguments);
                    return (typeof tagName !== 'undefined') ? tokenizeElement(tagName, attrsTokens, innerHtmlTokens) : [];
                }];
            } else {
                htmlTokens = tokenizeElement(tagNameRaw, attrsTokens, precompile(template.innerHTML));
            }
        } else if (typeof template !== 'undefined') {
            htmlTokens = [template];
        } else {
            htmlTokens = [];
        }

        return htmlTokens;
    };

    function compile(template) {
        var precompiled = precompile(template);

        return function process(precompiledOrTemplate){
            var args = [].slice.call(arguments, 1), compiled;
            // If precompiled, then array of strings or functions
            if (!Array.isArray(precompiledOrTemplate)) {
                precompiledOrTemplate = precompile(precompiledOrTemplate);
            }
            compiled = precompiledOrTemplate.map(function(strOrFunc){
                return (typeof strOrFunc === 'function')?process.apply(this, [strOrFunc.apply(this, args)].concat(args)):strOrFunc;
            });

            return compiled.join('');
        }.bind(this, precompiled);
    }

    function factory() {
        return {
            compile: compile
        }
    }

    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.jtoh = factory();
    }
})(typeof window === 'undefined'?global:window);

// console.log(jtoh.compile({
    // tagName: function(){return 'tr'},
    // attributes: {
        // zz: 123,
        // yy: function(a) {return a + '"aaa"'}
    // },
    // innerHTML: 'uuuuu'
// })('ssssss'));
