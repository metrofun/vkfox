"use strict";
module.exports = function (grunt) {
    var PAGES = ['background', 'popup', 'install'],
        LOCALES = ['ru', 'en', 'uk'];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        env : {
            dev: {
                NODE_ENV : 'DEVELOPMENT'
            },
            prod : {
                NODE_ENV : 'PRODUCTION'
            },
            opera: {
                TARGET: 'OPERA'
            },
            chrome: {
                TARGET: 'CHROME'
            }
        },
        preprocess : PAGES.reduce(function (memo, page) {
            memo[page] = {
                src : 'pages/' + page + '.tmpl.html',
                dest : 'pages/' + page + '.html'
            };

            return memo;
        }, {
            manifest: {
                src : 'manifest.tmpl.json',
                dest : 'manifest.json'
            }
        }),
        watch: PAGES.reduce(function (memo, page) {
            memo[page] = {
                files: 'pages/' + page + '.tmpl.html',
                tasks: ['preprocess:' + page]
            };

            return memo;
        }, {
            manifest: {
                files: 'manifest.tmpl.json',
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
                locale: locale,
                inputdir: 'modules/i18n/' + locale,
                output: 'modules/i18n/' + locale + '.js'
            };

            return memo;
        }, {}),
        less: {
            popup: {
                src: 'pages/popup.less',
                dest: 'pages/popup.css',
                options: {
                    compile: true,
                    compress: process.env.NODE_ENV === 'PRODUCTION'
                }
            },
            install: {
                src: 'pages/install.less',
                dest: 'pages/install.css',
                options: {
                    compile: true,
                    compress: process.env.NODE_ENV === 'PRODUCTION'
                }
            }
        },
        clean: {
            build: ['build/'],
            manifest: ['manifest.json'],
            pages: [
                'pages/*.html',
                '!pages/*.tmpl.html',
                'pages/*.js',
                'pages/*.css'
            ]
        },
        copy: {
            build:  {
                expand: true,
                src: [
                    'components/font-awesome/font/fontawesome-webfont.woff',
                    'components/jquery/jquery.js',
                    'components/angular-unstable/angular.js',
                    'components/underscore/underscore.js',
                    'components/backbone/backbone.js',

                    '_locales/**',

                    'modules/auth/oauth.vk.com.js',
                    'modules/**/*.html',
                    'modules/**/*.mp3',
                    'pages/*.html',
                    '!pages/*.tmpl.html',
                    'pages/*.js',
                    'pages/*.css',
                    'images/*',
                    'manifest.json'
                ],
                dest: 'build/'
            }
        },
        //Next two targets concatenates js/css
        useminPrepare: {
            html: [
                'pages/*.html',
                '!pages/*.tmpl.html'
            ],
            options: {
                // root: '.',
                dest: '.'
            }
        },
        usemin: {
            html: [
                'pages/*.html',
                '!pages/*.tmpl.html'
            ]
        },
        compress: {
            main: {
                options: {
                    level: '9', //best compression
                    archive: 'build.zip'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'build/',
                        src: ['**']
                    }
                ]
            }
        }
    });

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

    grunt.registerTask(
        'default',
        ['env:chrome', 'env:dev', 'preprocess', 'messageformat', 'less', 'watch']
    );

    grunt.registerTask('build', [
        'clean',
        'env:prod',
        'preprocess',
        'messageformat',
        'less',
        'useminPrepare',
        'concat',
        'usemin',
        'copy:build',
        'compress'
    ]);
    grunt.registerTask('build:opera', ['env:opera', 'build']);
    grunt.registerTask('build:chrome', ['env:chrome', 'build']);
};
