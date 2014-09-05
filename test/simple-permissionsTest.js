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

	define(['simple-permissions', '_'], function (/** PermissionsExports */permissionsExport, /*_.LoDashStatic*/_) {
		var grant = permissionsExport.grant,
			revoke = permissionsExport.revoke;

		/**
		 * @type {{name: string, storage: Entry[]}}
		 */
		var Foo = {
				name: 'Foo',
				storage: []
			},
			s = Foo.storage;

		describe('test grant', function (param) {
			it('should pass basic case', function () {
				var str = 'whatever';
				grant(s, Foo.name, {Bar: [str]});
				var entry = _.find(s, {target: Foo.name, source: 'Bar'});

				expect(s.length).toBe(1);
				expect(entry).toEqual(jasmine.any(Object));
				expect(entry.permissions[0]).toBe(str);
			});
			it('should work with multiple targets', function () {
				var str = 'whatever';
				grant(s, ['Bar', 'Baz', 'Qux'], {Foo: [str]});
				var results = [
					_.find(s, {target: 'Bar', source: Foo.name}),
					_.find(s, {target: 'Baz', source: Foo.name}),
					_.find(s, {target: 'Qux', source: Foo.name})
				];

				expect(s.length).toBe(4);
				_.each(results, function (result) {
					expect(result).toEqual(jasmine.any(Object));
					expect(result.permissions[0]).toBe(str);
				});
			});
			it('should work with multiple permission rules', function () {
				var str1 = 'anything';
				var str2 = 'something else';
				grant(s, 'Bar', {Foo: [str1], Baz: [str2]});
				var result1 = _.find(s, {target: 'Bar', source: Foo.name});
				var result2 = _.find(s, {target: 'Bar', source: 'Baz'});

				expect(s.length).toBe(5);
				expect(result1.permissions[1]).toBe(str1);
				expect(result2).toEqual(jasmine.any(Object));
				expect(result2.permissions[0]).toBe(str2);
			});
		});

		describe('test revoke', function (param) {
			/**
			 * @type {{name: string, storage: Entry[]}}
			 */
			it('should pass basic case', function () {
				revoke(s, 'Foo', {Bar: ['whatever']});

				expect(s.length).toBe(4);
				expect(_.find(s, {target: Foo.name, source: 'Bar'})).not.toBeDefined();
			});
			it('should work with multiple permissions', function () {
				revoke(s, 'Bar', {Foo: ['anything'], Baz: ['something else']});

				expect(s.length).toBe(3);
				expect(_.find(s, {target: 'Bar', source: Foo.name}).permissions[0]).toBe('whatever');
				expect(_.find(s, {target: 'Bar', source: 'Baz'})).not.toBeDefined();
			});
			it('should work with multiple permission rules', function () {
				revoke(s, ['Bar', 'Baz', 'Qux'], {Foo: ['whatever']});

				expect(s.length).toBe(0);
			});
		});
	});
}());