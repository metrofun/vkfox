"use strict";
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            less: {
                files: [
                    'app/modules/popup/*/*.less',
                    'app/modules/popup/*/*/*.less'
                ],
                tasks: [
                    'concat:less',
                    'less:all',
                    'clean:less'
                ],
                options: {
                    interrupt: true
                }
            },
            popupJs: {
                files: 'app/modules/popup/**/*.js',
                tasks: ['concat:popupJs'],
                options: {
                    interrupt: true
                }
            },
            backgroundJs: {
                files: 'app/modules/background/**/*.js',
                tasks: ['concat:backgroundJs'],
                options: {
                    interrupt: true
                }
            },
            messages: {
                files: 'app/modules/popup/i18n/**/*.json',
                tasks: ['messageformat'],
                options: {
                    interrupt: true
                }
            }
        },
        messageformat: {
            ru: {
                locale: 'ru',
                inputdir: 'app/modules/popup/i18n/ru',
                output: 'app/modules/popup/i18n/ru.js'
            }
        },
        concat: {
            less: {
                src: [
                    'app/modules/popup/*/*.less',
                    'app/modules/popup/*/*/*.less'
                ],
                dest: 'app/style.less'
            },
            popupJs: {
                src: [
                    'app/modules/popup/**/*.js'
                ],
                dest: 'app/popup.js'
            },
            backgroundJs: {
                src: [
                    'app/modules/background/**/*.js'
                ],
                dest: 'app/background.js'
            }
        },
        less: {
            all: {
                src: '<%= concat.less.dest %>',
                dest: 'app/style.css',
                options: {
                    compile: true
                    // compress: true
                }
            }
        },
        clean: {
            less: ['<%= concat.less.dest %>']
        }
    });

    grunt.loadNpmTasks('grunt-messageformat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask(
        'default',
        ['concat', 'messageformat', 'less:all', 'clean:less', 'watch']
    );

};
