/*! simple-permissions - v4.0.1 - 2015-06-17
* https://github.com/szarouski/simple-permissions
 Licensed Unlicense
* Description Trivial permissions implementation - takes an array and stores permissions from multiple targets for sources. 100% tested.
* Author Sergey Zarouski, http://webuniverse.io
*/

//noinspection ThisExpressionReferencesGlobalObjectJS
(function UMD(root, factory) {
	/*eslint complexity:6*/
	'use strict';
	var isNode = typeof window !== 'object';
	if (typeof define === 'function' && define.amd) {
		define(['exports', '_'], factory);
	} else if (typeof exports === 'object') {
		factory((isNode ? exports : exports.permissions = {}), require(isNode ? 'lodash' : '_'));
	} else {
		//noinspection JSUnusedGlobalSymbols
		var rootExports = root.exports || (root.exports = {});
		factory((rootExports.permissions = {}), root._);
	}
}(
	this,
	function initSimplePermissions(moduleExports, /*_.LoDashStatic*/_) {
		'use strict';

		/**
		 * @param {String} target
		 * @param {String} source
		 * @param {String[]} permissions
		 * @class SimplePermissions
		 */
		function SimplePermissions(target, source, permissions) {
			this.target = target;
			this.source = source;
			this.permissions = permissions;
		}

		SimplePermissions.prototype = {
			constructor: SimplePermissions,
			/**
			 * @param {String[]} permissions
			 */
			addPermissions: function addPermissions(permissions) {
				this.permissions = _.union(this.permissions, permissions);
			},
			/**
			 * @param {String[]} permissions
			 */
			removePermissions: function removePermissions(permissions) {
				this.permissions = _.difference(this.permissions, permissions);
			},
			/**
			 * @param {SimplePermissions[]} storage
			 */
			addToStorage: function addToStorage(storage) {
				storage.push(this);
			},
			/**
			 * @param {SimplePermissions[]} storage
			 */
			removeFromStorageWhenEmpty: function removeFromStorageWhenEmpty(storage) {
				if (!this.permissions.length) {
					var index = _.indexOf(storage, this);
					storage.splice(index, 1);
				}
			}
		};

		/**
		 * @class SimplePermissions.Exports
		 */
		var exports = moduleExports;
		exports.grant = grant;
		exports.revoke = revoke;

		/**
		 * Create/append permissions in a storage
		 * @name SimplePermissions.Exports#grant
		 * @param {SimplePermissions[]} storage
		 * @param {String|Array} to
		 * @param {Object} permissionsMap
		 */
		function grant(storage, to, permissionsMap) {
			to = ensureArray(to);

			_.each(to, _.partial(updateStorageUsingMap, storage, permissionsMap, addOrUpdatePermissions));
		}

		/**
		 * Reduce/Remove permissions in a storage
		 * @name SimplePermissions.Exports#revoke
		 * @param {SimplePermissions[]} storage
		 * @param {String|Array} from
		 * @param {Object} permissionsMap
		 */
		function revoke(storage, from, permissionsMap) {
			from = ensureArray(from);

			_.each(from, _.partial(updateStorageUsingMap, storage, permissionsMap, removeOrUpdatePermissions));
		}

		/**
		 * if it is not an array already, convert input to array
		 * @param {*} input
		 * @return {[]}
		 */
		function ensureArray(input) {
			if (!_.isArray(input)) {
				input = [input];
			}
			return input;
		}

		/**
		 * to update permissions go over permissions map and update target's storage SimplePermissions
		 * @param {SimplePermissions[]} storage
		 * @param {Object} map
		 * @param {Function} updater
		 * @param {String} target
		 */
		function updateStorageUsingMap(storage, map, updater, target) {
			_.each(map, _.partial(updater, target, storage));
		}

		/**
		 * to add permissions check if existing entry found and update permissions, otherwise add new entry
		 * @param {String} target
		 * @param {SimplePermissions[]} storage
		 * @param {Array} permissions
		 * @param {String} source
		 */
		function addOrUpdatePermissions(target, storage, permissions, source) {
			/**
			 * @type {SimplePermissions}
			 */
			var entry = _.find(storage, {target: target, source: source});
			if (entry) {
				entry.addPermissions(permissions);
			} else {
				new SimplePermissions(target, source, permissions).addToStorage(storage);
			}
		}

		/**
		 * private method which handles removals
		 * @param {String} target
		 * @param {SimplePermissions[]} storage
		 * @param {Array} permissions
		 * @param {String} source
		 */
		function removeOrUpdatePermissions(target, storage, permissions, source) {
			//remove when no permissions left

			var entry = _.find(storage, {target: target, source: source});
			if (entry) {
				entry.removePermissions(permissions);
				entry.removeFromStorageWhenEmpty(storage);
			}
		}
	}
));