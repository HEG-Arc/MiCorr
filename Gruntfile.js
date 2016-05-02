module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        
        babel: {
            es6: {
                files: [
                    {
                        expand: true,
			cwd: 'micorr/stratigraphies/static/micorr/scripts/ES2015',
                        src: '**/*.js',
                        ext: '.js',
			dest: 'micorr/stratigraphies/static/micorr/scripts/'	
                    }
                ]
            }
        },
	watch: {
      		scripts: {
        	files: "micorr/stratigraphies/static/micorr/scripts/ES2015/**/*.js",
        	tasks: ["babel"]
		}
      }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.registerTask("default", ["babel"]);
}


