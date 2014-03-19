"use strict";
module.exports = function (grunt) {
    var FIREFOX = 'FIREFOX',
        CHROME = 'CHROME',
        OPERA = 'OPERA',
        PRODUCTION = 'PRODUCTION',
        DEVELOPMENT = 'DEVELOPMENT',
        BROWSERS = [FIREFOX, CHROME, OPERA],
        SRC_DIR = 'develop/',
        LOCALES = ['ru', 'en', 'uk'];

    grunt.loadNpmTasks('grunt-inline-angular-templates');
    grunt.loadNpmTasks('grunt-messageformat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-mozilla-addon-sdk');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        env : {
            opera: {TARGET: OPERA},
            chrome: {TARGET: CHROME},
            firefox: {TARGET: FIREFOX},
            production: {ENV : PRODUCTION},
            development: {ENV : DEVELOPMENT}
        },
        inline_angular_templates: {
            popup: {
                files: {
                    'pages/popup.html': ['modules/*/*.tmpl.html']
                }
            }
        },
        browserify: (function () {
            var vendorShim = {
                'angularKeypress': {
                    path: 'bower_components/angular-ui-utils/modules/keypress/keypress.js',
                    exports: 'angular',
                    depends: {angular: 'angular'}
                },
                //we create a chain of moment.js => lang/ru.js => lang/uk.js
                'moment': {
                    path: 'bower_components/moment/lang/ru.js',
                    exports: 'moment',
                    depends: {moment1: 'moment'}
                },
                'moment1': {
                    path: 'bower_components/moment/lang/uk.js',
                    exports: 'moment',
                    depends: {moment2: 'moment'}
                },
                'moment2': {
                    path: 'bower_components/moment/moment.js',
                    exports: 'moment'
                },
                'angularSanitize': {
                    path: 'bower_components/angular-sanitize/angular-sanitize.js',
                    exports: 'angular',
                    depends: {angular: 'angular'}
                },
                'bootstrapDropdown': {
                    path: 'bower_components/bootstrap/js/bootstrap-dropdown.js',
                    exports: 'jQuery',
                    depends: {zepto: 'jQuery'}
                },
                'bootstrapTooltip': {
                    path: 'bower_components/bootstrap/js/bootstrap-tooltip.js',
                    exports: 'jQuery',
                    depends: {zepto: 'jQuery'}
                },
                'angular': {
                    path: 'bower_components/angular-unstable/angular.js',
                    exports: 'angular'
                },
                'javascript-linkify': {
                    path: 'bower_components/javascript-linkify/ba-linkify.js',
                    exports: 'linkify',
                },
                'zepto': {
                    path: 'bower_components/zeptojs/src/event.js',
                    exports: '$',
                    depends: {zepto1: 'Zepto'}
                },
                'zepto1': {
                    path: 'bower_components/emoji/lib/emoji.js',
                    exports: 'Zepto',
                    depends: {zepto2: 'Zepto'}
                },
                'zepto2': {
                    path: 'bower_components/zeptojs/src/data.js',
                    exports: 'Zepto',
                    depends: {zepto3: 'Zepto'}
                },
                'zepto3': {
                    path: 'bower_components/zeptojs/src/selector.js',
                    exports: 'Zepto',
                    depends: {zepto4: 'Zepto'}
                },
                'zepto4': {
                    path: 'bower_components/zeptojs/src/detect.js',
                    exports: 'Zepto',
                },
                'jEmoji': {
                    path: 'bower_components/zeptojs/src/zepto.js',
                    exports: 'jEmoji'
                }
            }, commonExternals = ['backbone', 'underscore', 'vow'], options = {
                prelude: grunt.file.read('node_modules/browserify/node_modules/browser-pack/prelude.js'),
                external: Object.keys(vendorShim).concat(commonExternals),
                ignore: [
                    'browser/browser.bg.js',
                    'tracker/tracker.bg.js',
                    './request.bg.js',
                    './tracker.bg.js',
                    './mediator.bg.js',
                    'chrome',
                    'toolkit/loader',
                    '@loader/options',
                    'sdk/timers',
                    'sdk/system',
                    'sdk/system/globals',
                    'sdk/tabs',
                    'sdk/self',
                    'sdk/simple-storage'
                ]
            };

            return BROWSERS.reduce(function (browserify, browser) {
                browserify[browser.toLowerCase() + 'Popup'] = {
                    files: {
                        'pages/popup.js': ['modules/app/app.pu.js'],
                    },
                    options: options
                };
                browserify[browser.toLowerCase() + 'Install'] = {
                    files: {
                        'pages/install.js': ['modules/app/app.install.js'],
                    },
                    options: options
                };
                browserify[browser.toLowerCase() + 'Background'] = {
                    files: {
                        'pages/background.js': [
                            //zepto is hardcoded (simply concatenated)
                            //to make it globally available,
                            //because require('zepto') would break cfx xpi.
                            'bower_components/zepto-bootstrap/zepto.js',
                            'modules/app/app.bg.js'
                        ],
                    },
                    options: {
                        prelude: grunt.file.read('node_modules/browserify/node_modules/browser-pack/prelude.js'),
                        external: commonExternals,
                        ignore: [
                            './mediator.pu.js',
                            'browserAction',
                            'sdk/timers',
                            '@loader/options',
                            'sdk/system',
                            'sdk/system/globals',
                            'chrome',
                            'sdk/system/unload',
                            'sdk/system',
                            'sdk/tabs',
                            'sdk/request',
                            'sdk/self',
                            'sdk/page-worker',
                            'sdk/page-mod',
                            'toolkit/loader',
                            'sdk/simple-storage',
                            'sdk/notifications',
                            (browser !== FIREFOX) && './yandex.moz.bg.js',
                            (browser !== CHROME) && './yandex.webkit.bg.js'
                        ].filter(Boolean)
                    }
                };

                return browserify;
            }, {
                vendorCommon: {
                    src: commonExternals,
                    dest: 'pages/vendor.js',
                    options: {
                        prelude: grunt.file.read('node_modules/browserify/node_modules/browser-pack/prelude.js'),
                        alias: [
                            '../node_modules/backbone/backbone.js:backbone',
                            '../node_modules/underscore/underscore.js:underscore',
                            '../node_modules/vow/lib/vow.js:vow'
                        ]
                    }
                },
                vendorPopup: {
                    files: {
                        'pages/vendor.pu.js': [Object.keys(vendorShim)]
                    },
                    options: {
                        prelude: grunt.file.read('node_modules/browserify/node_modules/browser-pack/prelude.js'),
                        shim: vendorShim
                    }
                }
            });
        })(),
        'mozilla-cfx': {
            run: {
                options: {
                    'mozilla-addon-sdk': '1_15',
                    extension_dir: '.',
                    command: 'run',
                    arguments: '-p ../ff'
                }
            },
            'run-build': {
                options: {
                    'mozilla-addon-sdk': '1_15',
                    extension_dir: '../build/firefox',
                    command: 'run',
                    arguments: '-p ../../ff'
                }
            },

            xpi: {
                options: {
                    'mozilla-addon-sdk': '1_15',
                    extension_dir: '../build/firefox/',
                    command: 'xpi',
                    arguments: '-p ../../ff'
                }
            }
        },
        'mozilla-addon-sdk': {
            '1_15': {
                options: {
                    revision: '1.15'
                }
            }
        },
        preprocess : {
            popup: {
                src : 'pages/popup.raw.html',
                dest : 'pages/popup.html'
            },
            install: {
                src : 'pages/install.raw.html',
                dest : 'pages/install.html'
            },
            manifest: {
                src : 'manifest.raw.json',
                dest : 'manifest.json'
            },
            env: {
                src : 'modules/env/env.raw.js',
                dest : 'modules/env/env.js'
            }
        },
        watch: BROWSERS.reduce(function (watch, browser) {
            watch[browser.toLowerCase()] = {
                files: 'modules/**/*.js',
                tasks: [
                    'browserify:' + browser.toLowerCase() + 'Popup',
                    'browserify:' + browser.toLowerCase() + 'Background',
                    'browserify:' + browser.toLowerCase() + 'Install'
                ]
            };

            return watch;
        }, {
            manifest: {
                files: 'manifest.raw.json',
                tasks: ['preprocess:manifest'],
                options: {
                    interrupt: true
                }
            },
            messages: {
                files: 'modules/i18n/**/*.json',
                tasks: ['messageformat'],
                options: {
                    interrupt: true
                }
            },
            less: {
                files: 'modules/**/*.less',
                tasks: ['less']
            }
        }),
        //localization
        messageformat: LOCALES.reduce(function (memo, locale) {
            memo[locale] = {
                namespace: 'module.exports',
                locale: locale,
                inputdir: 'modules/i18n/' + locale,
                output: 'modules/i18n/' + locale + '.js'
            };

            return memo;
        }, {}),
        less: {
            all: {
                expand: true,
                cwd: 'pages/',
                dest: 'pages/',
                src: ['*.less'],
                ext: '.css',
                options: {
                    compile: true,
                    compress: process.env.ENV === PRODUCTION
                }
            }
        },
        // Prevent Warning: Cannot delete files outside the current working directory.
        clean: BROWSERS.reduce(function (clean, browser) {
            var browserLowercased = browser.toLowerCase();
            clean[browserLowercased] = ['../build/' + browserLowercased];
            return clean;
        }, {options: {force: true}}),
        copy: [CHROME, OPERA].reduce(function (copy, browser) {
            copy[browser.toLowerCase()] = {
                expand: true,
                src: [
                    'manifest.json',

                    '_locales/**',
                    'assets/**',

                    'bower_components/font-awesome/font/fontawesome-webfont.ttf',
                    'bower_components/emoji/lib/emoji.css',
                    'bower_components/emoji/lib/emoji.png',

                    'modules/auth/oauth.vk.com.js',
                    'modules/resize/dimensions.pu.js',
                    'modules/notifications/*.ogg',

                    'pages/*.html',
                    '!pages/*.raw.html',
                    'pages/*.css',
                    'pages/*.js'
                ],
                dest: '../build/' + browser.toLowerCase()
            };

            return copy;
        }, {
            firefox: {
                expand: true,
                src: [
                    'package.json',
                    'packages/**',

                    'data/assets/**',

                    //best font for window and osx in firefox and chrome
                    'data/bower_components/font-awesome/font/fontawesome-webfont.ttf',
                    'data/bower_components/emoji/lib/emoji.css',
                    'data/bower_components/emoji/lib/emoji.png',

                    'data/modules/yandex/search.moz.xml',
                    'data/modules/notifications/*.ogg',
                    'data/modules/notifications/firefox.html',
                    'data/modules/*/*.js',

                    'data/pages/*.html',
                    '!data/pages/*.raw.html',
                    'data/pages/*.css',
                    'data/pages/*.js',
                    '!data/pages/background.js',
                ],
                dest: '../build/firefox'
            }
        }),
        //Next two targets concatenates js/css
        useminPrepare: {
            html: BROWSERS.reduce(function (html, browser) {
                return html.concat([
                    browser + '/pages/*.html',
                    '!' + browser + '/pages/*.raw.html'
                ]);
            }, []),
            options: {
                dest: '.'
            }
        },
        usemin: {
            html: BROWSERS.reduce(function (html, browser) {
                return html.concat([
                    browser + '/pages/*.html',
                    '!' + browser + '/pages/*.raw.html'
                ]);
            }, [])
        },
        compress: BROWSERS.reduce(function (compress, browser) {
            compress[browser.toLowerCase()] = {
                options: {
                    level: '9', //best compression
                    archive: '../build/' + browser.toLowerCase() + '.zip'
                },
                files: [
                    {
                        expand: true,
                        cwd: '../build/' + browser.toLowerCase() + '/',
                        src: ['**']
                    }
                ]
            };
            return compress;
        }, {})
    });


    grunt.file.setBase(SRC_DIR);

    [FIREFOX].forEach(function (browser) {
        var browserLowercased = browser.toLowerCase(),
            commonTasks = [
                'env:firefox',
                'env:development',
                'less',
                'preprocess:env',
                'preprocess:install',
                'preprocess:popup',
                'inline_angular_templates',
                'browserify:vendorCommon',
                'browserify:vendorPopup',
                'browserify:firefoxPopup',
                'browserify:firefoxInstall',
                'mozilla-addon-sdk'
            ];

        grunt.registerTask(browserLowercased, commonTasks.concat([
            'mozilla-cfx:run'
        ]));
        grunt.registerTask('build:' + browserLowercased, commonTasks.concat([
            'clean:' + browserLowercased,
            'copy:' + browserLowercased,
            'mozilla-cfx:xpi',
            'mozilla-cfx:run-build'
        ]));
    });

    [CHROME, OPERA].forEach(function (browser) {
        var browserLowercased = browser.toLowerCase(),
            commonTasks = [
                'env:' + browserLowercased,
                'less',
                'messageformat',
                'preprocess:env',
                'preprocess:popup',
                'preprocess:install',
                'preprocess:manifest',
                'inline_angular_templates',
                'browserify:vendorCommon',
                'browserify:vendorPopup',
                'browserify:' + browserLowercased + 'Popup',
                'browserify:' + browserLowercased + 'Install',
                'browserify:' + browserLowercased + 'Background'
            ];

        grunt.registerTask(browserLowercased, commonTasks.concat([
            'watch:' + browserLowercased
        ]));
        grunt.registerTask('build:' + browserLowercased, commonTasks.concat([
            'clean:' + browserLowercased,
            'copy:' + browserLowercased,
            'compress:' + browserLowercased
        ]));
    });
};
