(function () {
	'use strict';

	/**
	 * @typedef {Object} __karma__
	 * @property {Object} files
	 */
	/**
	 * @typedef {Object} requirejs
	 * @property {Function} config
	 */
	var environment = typeof window === 'object' ? 'browser' : 'node',
		projectMainFolder = 'lib/',
		paths = {},
		dependencies = [];

	function addDependencies() {
		for (var file in window.__karma__.files) {
			if (window.__karma__.files.hasOwnProperty(file) && /(Test)\.js$/.test(file)) {
				dependencies.push(file);
			}
		}
	}

	if (environment === 'browser') {
		addDependencies();
		paths._ = '../bower_components/lodash/lodash';

		require.config({
			// Karma serves files from '/base'
			baseUrl: '/base/' + projectMainFolder,

			paths: paths,

			// ask Require.js to load these files (all our tests)
			deps: dependencies,

			// start test run, once Require.js is done
			callback: window.__karma__.start
		});
	} else {
		paths._ = 'lodash';
		module.exports = {
			projectMainFolder: projectMainFolder,
			paths: paths
		};
	}
}());