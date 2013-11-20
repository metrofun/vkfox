"use strict";
module.exports = function (grunt) {
    var BROWSERS = ['chrome', 'opera', 'firefox'],
        SRC_DIR = 'develop/',
        PRODUCTION = 'production',
        DEVELOP = 'develop',
        LOCALES = ['ru', 'en', 'uk'];

    grunt.loadNpmTasks('grunt-messageformat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
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
            opera: {
                TARGET: 'OPERA'
            },
            chrome: {
                TARGET: 'CHROME'
            },
            firefox: {
                TARGET: 'FIREFOX'
            },
            production: {
                NODE_ENV : PRODUCTION
            },
            develop: {
                NODE_ENV : DEVELOP
            }
        },
        browserify: {
            popup: {
                files: {
                    'firefox/popup.js': ['modules/app/app.pu.js'],
                }
            }
        },
        "mozilla-addon-sdk": {
            '1_14': {
                options: {
                    revision: "1.14"
                }
            }
        },
        "mozilla-cfx": {
            run: {
                options: {
                    "mozilla-addon-sdk": "1_14",
                    extension_dir: ".",
                    command: "run",
                    arguments: "-p tmp/ff"
                }
            }
        },
        preprocess : BROWSERS.reduce(function (preprocess, browser) {
            preprocess[browser] = {
                expand: true,
                cwd: browser + '/pages/',
                dest: browser + '/pages/',
                src: ['*.raw.html'],
                ext: '.html'
            };

            return preprocess;
        }, {
            manifest: {
                src : 'manifest.raw.json',
                dest : 'manifest.json'
            }
        }),
        // optimize, preprocess only single file
        watch: BROWSERS.reduce(function (watch, browser) {
            watch[browser] = {
                files: browser + '/pages/*.raw.html',
                tasks: ['preprocess:' + browser]
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
        less: BROWSERS.reduce(function (less, browser) {
            less[browser] = {
                expand: true,
                cwd: browser + '/pages/',
                dest: browser + '/pages/',
                src: ['*.less'],
                ext: '.css',
                options: {
                    compile: true,
                    compress: process.env.NODE_ENV === PRODUCTION
                }
            };
            return less;
        }, {}),
        clean: {
            // Warning: Cannot delete files outside the current working directory.
            options: {force: true},
            build: ['../build'],
            manifest: ['manifest.json'],
            pages: [
                'pages/*.html',
                '!pages/*.raw.html',
                'pages/*.js',
                'pages/*.css'
            ]
        },
        copy: BROWSERS.reduce(function (copy, browser) {
            copy[browser] = {
                expand: true,
                src: [
                    '_locales/**',
                    'assets/**',
                    'manifest.json',

                    'components/font-awesome/font/fontawesome-webfont.ttf',
                    'components/emoji/lib/emoji.png',
                    'components/emoji/lib/emoji.css',
                    'components/jquery/jquery.js',
                    'components/angular-unstable/angular.js',
                    'components/underscore/underscore.js',
                    'components/backbone/backbone.js',

                    'modules/auth/oauth.vk.com.js',
                    'modules/**/*.html',
                    'modules/**/*.ogg',
                    browser + '/pages/*.html',
                    '!' + browser + '/pages/*.raw.html',
                    browser + '/pages/*.js',
                    browser + '/pages/*.css',
                ],
                dest: '../build/' + browser
            };

            return copy;
        }, {}),
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
            compress[browser] = {
                options: {
                    level: '9', //best compression
                    archive: '../build/' + browser + '.zip'
                },
                files: [
                    {
                        expand: true,
                        cwd: '../build/' + browser + '/',
                        src: ['**']
                    }
                ]
            };
            return compress;
        }, {})
    });


    grunt.file.setBase(SRC_DIR);


    BROWSERS.forEach(function (browser) {
        grunt.registerTask(browser, [
            'env:' + browser,
            'preprocess:manifest',
            'preprocess:' + browser,
            'messageformat',
            'less:' + browser,
            'watch'
        ]);

        grunt.registerTask('build:' + browser, [
            'clean',
            'env:production',
            'env:' + browser,
            'preprocess:manifest',
            'preprocess:' + browser,
            'messageformat',
            'less:' + browser,
            'useminPrepare',
            'concat',
            'usemin',
            'copy:' + browser,
            'compress:' + browser
        ]);
    });

    grunt.registerTask('mozilla', [
        'mozilla-addon-sdk',
        'browserify',
        'mozilla-cfx'
    ]);

};
