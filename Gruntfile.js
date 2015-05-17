/*global module:false*/
//noinspection GjsLint
module.exports = function initGrunt(grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			' Licensed <%= pkg.license %>\n' +
			'* Description <%= pkg.description %>\n' +
			'* Author <%= pkg.author.name %>, <%= pkg.author.homepage %>\n' +
			'*/\n\n',
		// Task configuration.
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			dist: {
				src: ['lib/<%= pkg.name %>.js'],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				src: '<%= concat.dist.dest %>',
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},
		eslint: {
			options: {
				useEslintrc: true
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			'lib_test': {
				src: ['lib/**/*.js', 'test/**/*.js']
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		},
		watch: {
			gruntfile: {
				files: '<%= eslint.gruntfile.src %>',
				tasks: ['eslint:gruntfile']
			},
			'lib_test': {
				files: '<%= eslint.lib_test.src %>',
				tasks: ['eslint:lib_test', 'karma:unit']
			}
		},
		githooks: {
			all: {
				// Will run the eslint and test:unit tasks at every commit
				'pre-commit': 'default'
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-githooks');

	// Default task.
	grunt.registerTask('default', ['eslint', 'karma', 'test-node', 'concat', 'uglify']);

	grunt.registerTask('test-node', function () {
		var shelljs = require('shelljs');
		shelljs.exec('npm run test-node');
		/* istanbul ignore if  */
		if (shelljs.error()) {
			//noinspection ExceptionCaughtLocallyJS
			throw new Error('test contains errors');
		}
	});
};
