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
                files: [
                    'app/modules/popup/**/*.js',
                    'app/modules/common/**/*.js'
                ],
                tasks: ['concat:popupJs'],
                options: {
                    interrupt: true
                }
            },
            backgroundJs: {
                files: [
                    'app/modules/background/**/*.js',
                    'app/modules/common/**/*.js'
                ],
                tasks: ['concat:backgroundJs'],
                options: {
                    interrupt: true
                }
            },
            messages: {
                files: 'app/modules/common/i18n/**/*.json',
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
                inputdir: 'app/modules/common/i18n/ru',
                output: 'app/modules/common/i18n/ru.js'
            }
        },
        uglify: {
            backgroundComponents: {
                files: {
                    'app/background.components.min.js': [
                        'components/jquery/jquery.js',
                        'components/underscore/underscore.js',
                        'components/backbone/backbone.js',
                        'components/angular-unstable/angular.js'
                    ]
                }
            },
            popupComponents: {
                files: {
                    'app/popup.components.min.js': [
                        'components/emoji/lib/emoji.js',
                        'components/moment/moment.js',
                        'components/javascript-linkify/ba-linkify.js',
                        'components/jquery/jquery.js',
                        'components/bootstrap/js/bootstrap-tooltip.js',
                        'components/bootstrap/js/bootstrap-dropdown.js',
                        'components/underscore/underscore.js',
                        'components/backbone/backbone.js',
                        'components/angular-unstable/angular.js',
                        'components/angular-ui-utils/modules/keypress/keypress.js',
                        'components/angular-ui-utils/modules/route/route.js'
                    ]
                }
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
                    'app/popup.components.min.js',
                    'app/modules/common/**/*.js',
                    'app/modules/popup/**/*.js'
                ],
                dest: 'app/popup.js'
            },
            backgroundJs: {
                src: [
                    'app/background.components.min.js',
                    'app/modules/common/**/*.js',
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
            less: ['<%= concat.less.dest %>'],
            uglify: ['app/*.components.min.js']
        },
        copy: {
            vendor: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: 'components/emoji/lib/*',
                        dest: 'app/vendor/emoji/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: 'components/font-awesome/font/*',
                        dest: 'app/vendor/font-awesome/'
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
    grunt.registerTask(
        'default',
        ['copy:vendor', 'messageformat', 'concat', 'less:all', 'watch']
    );

};
