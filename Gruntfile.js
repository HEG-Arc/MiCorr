module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        // Other grunt tasks
        // ...

        babel: {
            es6: {
                files: [
                    {
                        expand: true,
                        src: ['micorr/stratigraphies/static/micorr/scripts/*.es6'],
                        ext: '.js'
                    }
                ]
            }
        }
    });

    grunt.registerTask("default", ["babel"]);
}


