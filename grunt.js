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
            },
            less: {
                src: 'app/_style.less',
                dest: 'app/style.css',
                options: {
                    compile: true
                }
            }
        },
        clean: {
            less: 'app/_style.less'
        },
        concat: {
            less: {
                src: [
                    'app/style.less',
                    'app/modules/popup/*/*.less'
                ],
                dest: 'app/_style.less'
            }
        },
        watch: {
            design: {
                files: ['<config:recess.design.src>'],
                tasks: 'recess:design'
            },
            less: {
                files: ['<config:concat.less.src>'],
                tasks: 'concat:less recess:less clean:less'
            }
        }
    });


    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-clean');

    grunt.registerTask('default', 'watch:less');

};
