/*! simple-permissions - v1.0.5 - 2014-08-06
* https://github.com/szarouski/simple-permissions
 Licensed http://unlicense.org/
* Description Trivial permissions implementation - takes an array and stores permissions from multiple targets for sources. 100% tested.
* Author Sergey Zarouski, http://webuniverse.club
*/

(function (root, factory) {
	'use strict';
	var isNode = typeof window !== 'object';
	if (typeof define === 'function' && define.amd) {
		define(['exports', '_'], factory);
	} else if (typeof exports === 'object') {
		factory(exports, require(isNode ? 'lodash-node' : '_'));
	} else {
		factory((root.permissionsExports = {}), root._);
	}
}(
	this,
	/**
	 * @param exports
	 * @param {_.LoDashStatic} _
	 */
	function initSimplePermissions(exports, _) {
		'use strict';

		/**
		 * @typedef {{target: String, source: String, properties: Array}} Entry
		 */

		/**
		 * Create/append permissions in a storage
		 * @param {Entry[]} storage
		 * @param {String|Array} to
		 * @param {Object} permissions
		 */
		function grant(storage, to, permissions) {
			//jshint validthis: true
			if (typeof to === 'string') {
				to = [to];
			}

			/**
			 * private method which handles additions
			 * @param {String} target
			 * @param {Array} properties
			 * @param {String} source
			 */
			function addPermissions(target, properties, source) {
				/**
				 * @type {Entry}
				 */
				var targetSource = _.find(storage, {target: target, source: source});
				if (targetSource) {
					targetSource.properties = _.union(targetSource.properties, properties);
				} else {
					storage.push({
						target: target,
						source: source,
						properties: properties
					});
				}
			}

			_.each(to, function (target) {
				_.each(permissions, _.partial(addPermissions, target));
			});
		}

		/**
		 * Reduce/Remove permissions in a storage
		 * @param {Entry[]} storage
		 * @param {String|Array} from
		 * @param {Object} permissions
		 */
		function revoke(storage, from, permissions) {
			//jshint validthis: true
			if (typeof from === 'string') {
				from = [from];
			}

			/**
			 * private method which handles removals
			 * @param {String} target
			 * @param {Array} properties
			 * @param {String} source
			 */
			function removePermissions(target, properties, source) {
				//remove when no properties left
				_.remove(storage, function removeDataPermissions(entry) {
					if (entry.target === target && entry.source === source) {
						entry.properties = _.difference(entry.properties, properties);
						return !entry.properties.length;
					}
					return false;
				});
			}

			_.each(from, function (target) {
				_.each(permissions, _.partial(removePermissions, target));
			});
		}

		/**
		 * @typedef {{grant: grant, revoke: revoke}} PermissionsExports
		 */
		var _exports = {
			grant: grant,
			revoke: revoke
		};
		_.extend(
			exports,
			_exports
		);
	}
));