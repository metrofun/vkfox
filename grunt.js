module.exports = function (grunt) {

    grunt.initConfig({
        recess: {
            design: {
                src: [
                    'design/*.less'
                ],
                dest: 'design/style.css',
                options: {
                    compile: true
                }
            }
        },
        lint: {
            all: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
        },
        jshint: {
            options: {
                browser: true
            }
        },
        watch: {
            less: {
                files: ['<config:recess.design.src>'],
                tasks: 'recess'
            }
        }
    });


    grunt.loadNpmTasks('grunt-recess');

    grunt.registerTask('default', 'recess');

};
