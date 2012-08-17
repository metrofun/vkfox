module.exports = function(grunt) {

    grunt.initConfig({
        recess: {
            all: {
                src: [
                    'bootstrap/less/bootstrap.less',
                    'style.less'
                ],
                dest: 'style.css',
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
                files: ['<config:recess.all.src>', 'bootstrap/less/variables.less'],
                tasks: 'recess'
            }
        }
    });


    grunt.loadNpmTasks('grunt-recess');

    grunt.registerTask('default', 'recess');

};
