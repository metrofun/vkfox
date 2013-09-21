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
            }
        },
        preprocess : {
            production : {
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
        concat: {
            less: {
                src: [
                    'modules/popup/*/*.less',
                    'modules/popup/*/*/*.less'
                ],
                dest: 'style.less'
            }
        },
        less: {
            all: {
                src: 'popup.less',
                dest: 'popup.css',
                options: {
                    compile: true
                    // compress: true
                }
            }
        },
        clean: {
            less: ['<%= concat.less.dest %>']
        },
        copy: {
            build:  {
                expand: true,
                src: [
                    'modules/**/*.html',
                    'background.html',
                    'popup.html',
                    'manifest.json'
                ],
                dest: 'build/'
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

    grunt.registerTask(
        'default',
        ['env:dev', 'preprocess', 'messageformat', 'watch']
    );

    grunt.registerTask(
        'build',
        ['env:prod', 'preprocess', 'messageformat', 'copy:build']
    );

};
