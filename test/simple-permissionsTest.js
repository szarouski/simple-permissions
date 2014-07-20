/*global describe, it, expect, runs, jasmine*/
(function () {
	'use strict';
	//fallback for node testing
	var environment = typeof window === 'object' ? 'browser' : 'node',
		define, config, path, cwd;
	if (environment === 'node') {
		path = require('path');
		config = require(path.join(__dirname, 'test-main'));
		cwd = process.cwd();
		define = function define(deps, cb) {
			deps = deps.map(function (name) {
				var module = config.paths[name];
				if (!(name in config.paths)) {
					module = path.join(cwd, config.projectMainFolder + name);
				}
				return require(module);
			});
			cb.apply(null, deps);
		};
	} else {
		define = window.define;
	}

	define(['simple-permissions', '_'], function (/** PermissionsExports */permissionsExport, _) {
		var grant = permissionsExport.grant,
		    revoke = permissionsExport.revoke;

		/**
		 * @type {{name: string, storage: Entry[]}}
		 */
		var Pa = {
				name: 'Pa',
				storage: []
			},
			s = Pa.storage;

		describe('test grant', function (param) {
			it('should pass basic case', function () {
				var str = 'whatever';
				grant(s, Pa.name, {So: [str]});
				var entry = _(s).find({target: Pa.name, source: 'So'});

				expect(s.length).toBe(1);
				expect(entry).toEqual(jasmine.any(Object));
				expect(entry.properties[0]).toBe(str);
			});
			it('should work with multiple targets', function () {
				var str = 'whatever';
				grant(s, ['So', 'Do', 'Go'], {Pa: [str]});
				var results = [
					_(s).find({target: 'So', source: Pa.name}),
					_(s).find({target: 'Do', source: Pa.name}),
					_(s).find({target: 'Go', source: Pa.name})
				];

				expect(s.length).toBe(4);
				_.each(results, function (result) {
					expect(result).toEqual(jasmine.any(Object));
					expect(result.properties[0]).toBe(str);
				});
			});
			it('should work with multiple permission rules', function () {
				var str1 = 'anything';
				var str2 = 'something else';
				grant(s, 'So', {Pa: [str1], Do: [str2]});
				var result1 = _(s).find({target: 'So', source: Pa.name});
				var result2 = _(s).find({target: 'So', source: 'Do'});

				expect(s.length).toBe(5);
				expect(result1.properties[1]).toBe(str1);
				expect(result2).toEqual(jasmine.any(Object));
				expect(result2.properties[0]).toBe(str2);
			});
		});

		describe('test revoke', function (param) {
			/**
			 * @type {{name: string, storage: Entry[]}}
			 */
			it('should pass basic case', function () {
				revoke(s, 'Pa', {So: ['whatever']});

				expect(s.length).toBe(4);
				expect(_(s).find({target: Pa.name, source: 'So'})).not.toBeDefined();
			});
            it('should work with multiple properties', function () {
	            revoke(s, 'So', {Pa: ['anything'], Do: ['something else']});

                expect(s.length).toBe(3);
	            expect(_(s).find({target: 'So', source: Pa.name}).properties[0]).toBe('whatever');
	            expect(_(s).find({target: 'So', source: 'Do'})).not.toBeDefined();
            });
            it('should work with multiple permission rules', function () {
	            revoke(s, ['So', 'Do', 'Go'], {Pa: ['whatever']});

                expect(s.length).toBe(0);
            });
		});
	});
}());