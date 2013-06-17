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
                    'recess:less',
                    'clean:less'
                ],
                options: {
                    interrupt: true
                }
            },
            js: {
                files: 'app/modules/popup/**/*.js',
                tasks: ['concat:js'],
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
            js: {
                src: [
                    'app/modules/popup/**/*.js'
                ],
                dest: 'app/popup.js'
            }
        },
        recess: {
            less: {
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
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask(
        'default',
        ['concat', 'messageformat', 'recess:less', 'clean:less', 'watch']
    );

};
