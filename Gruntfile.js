"use strict";
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        recess: {
            less: {
                src: [
                    'app/style.less',
                    'app/modules/popup/*/*.less',
                    'app/modules/popup/*/*/*.less'
                ],
                dest: 'app/style.css',
                options: {
                    compile: true,
                    // compress: true
                }
            }
        },
        watch: {
            less: {
                files: '<%= recess.less.src %>',
                tasks: 'recess:less'
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-recess');
    grunt.registerTask('default', ['watch:less']);

};
