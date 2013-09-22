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
                src : 'background.tmpl.html',
                dest : 'background.html'
            },
            popup: {
                src : 'popup.tmpl.html',
                dest : 'popup.html'
            }
        },
        watch: {
            messages: {
                files: 'modules/common/i18n/**/*.json',
                tasks: ['messageformat'],
                options: {
                    interrupt: true
                }
            },
            less: {
                files: 'modules/popup/**/*.less',
                tasks: ['less'],
                options: {
                    interrupt: true
                }
            }
        },
        //localization
        messageformat: {
            ru: {
                locale: 'ru',
                inputdir: 'modules/common/i18n/ru',
                output: 'modules/common/i18n/ru.js'
            }
        },
        less: {
            dev: {
                src: 'popup.less',
                dest: 'popup.css',
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
                    'modules/background/auth/oauth.vk.com.js',
                    'modules/**/*.html',
                    'background.html',
                    'background.js',
                    'popup.html',
                    'popup.js',
                    'popup.css',
                    'images/*',
                    'manifest.json'
                ],
                dest: 'build/'
            }
        },
        useminPrepare: {
            html: ['popup.html', 'background.html']
        },
        usemin: {
            html: ['popup.html', 'background.html']
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
        ['env:dev', 'preprocess', 'messageformat', 'less', 'watch']
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

};
