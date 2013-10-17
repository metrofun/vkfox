"use strict";
module.exports = function (grunt) {

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
        preprocess : {
            background: {
                src : 'pages/background.tmpl.html',
                dest : 'pages/background.html'
            },
            popup: {
                src : 'pages/popup.tmpl.html',
                dest : 'pages/popup.html'
            },
            install: {
                src : 'pages/install.tmpl.html',
                dest : 'pages/install.html'
            },
            manifest: {
                src : 'manifest.tmpl.json',
                dest : 'manifest.json'
            }
        },
        watch: {
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
        },
        //localization
        messageformat: {
            ru: {
                locale: 'ru',
                inputdir: 'modules/i18n/ru',
                output: 'modules/i18n/ru.js'
            }
        },
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
            build: ['build/']
        },
        copy: {
            build:  {
                expand: true,
                src: [
                    'components/font-awesome/font/fontawesome-webfont.woff',
                    'modules/auth/oauth.vk.com.js',
                    'modules/**/*.html',
                    'pages/*.html',
                    'pages/*.js',
                    'pages/*.css',
                    'images/*',
                    'manifest.json'
                ],
                dest: 'build/'
            }
        },
        useminPrepare: {
            html: ['pages/*.html']
        },
        usemin: {
            html: ['pages/*.html']
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
        'clean:build',
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
