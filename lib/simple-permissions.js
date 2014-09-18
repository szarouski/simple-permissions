/*global exports*/

//noinspection OverlyComplexFunctionJS,ThisExpressionReferencesGlobalObjectJS
(function (root, factory) {
	//jshint maxcomplexity: false
	'use strict';
	var isNode = typeof window !== 'object';
	if (typeof define === 'function' && define.amd) {
		define(['exports', '_'], factory);
	} else if (typeof exports === 'object') {
		factory(exports, require(isNode ? 'lodash-node' : '_'));
	} else {
		//noinspection JSUnusedGlobalSymbols
		var rootExports = root.exports || (root.exports = {});
		factory((rootExports.permissions = {}), root._);
	}
}(
	this,
	function initSimplePermissions(/*Object*/exports, /*_.LoDashStatic*/_) {
		'use strict';

		/**
		 * @name PermissionsExports
		 */

		/**
		 * @param {String} target
		 * @param {String} source
		 * @param {Array} permissions
		 * @class Entry
		 */
		function Entry(target, source, permissions) {
			this.target = target;
			this.source = source;
			this.permissions = permissions;
		}

		/**
		 * @type {Entry.prototype}
		 */
		Entry.prototype = {
			constructor: Entry,
			/**
			 * @param {Array} permissions
			 */
			addPermissions: function addEntryPermissions(permissions) {
				this.permissions = _.union(this.permissions, permissions);
			},
			/**
			 * @param {Array} permissions
			 */
			removePermissions: function removeEntryPermissions(permissions) {
				this.permissions = _.difference(this.permissions, permissions);
			},
			/**
			 * @param {Entry[]} storage
			 */
			addToStorage: function addEntryToStorage(storage) {
				storage.push(this);
			},
			/**
			 * @param {Entry[]} storage
			 */
			removeFromStorageWhenEmpty: function removeEntryFromStorageWhenEmpty(storage) {
				if (!this.permissions.length) {
					var index = _.indexOf(storage, this);
					storage.splice(index, 1);
				}
			}
		};

		/**
		 * Create/append permissions in a storage
		 * @name PermissionsExports#grant
		 * @propertyOf PermissionsExports
		 * @param {Entry[]} storage
		 * @param {String|Array} to
		 * @param {Object} permissionsMap
		 */
		function grant(storage, to, permissionsMap) {
			to = ensureArray(to);

			_.each(to, _.partial(updateStorageUsingMap, storage, permissionsMap, addEntryOrUpdatePermissions));
		}

		/**
		 * Reduce/Remove permissions in a storage
		 * @name PermissionsExports#revoke
		 * @propertyOf PermissionsExports
		 * @param {Entry[]} storage
		 * @param {String|Array} from
		 * @param {Object} permissionsMap
		 */
		function revoke(storage, from, permissionsMap) {
			from = ensureArray(from);

			_.each(from, _.partial(updateStorageUsingMap, storage, permissionsMap, removeEntryOrUpdatePermissions));
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
		 * to update permissions go over permissions map and update target's storage Entry
		 * @param {Entry[]} storage
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
		 * @param {Entry[]} storage
		 * @param {Array} permissions
		 * @param {String} source
		 */
		function addEntryOrUpdatePermissions(target, storage, permissions, source) {
			/**
			 * @type {Entry}
			 */
			var entry = _.find(storage, {target: target, source: source});
			if (entry) {
				entry.addPermissions(permissions);
			} else {
				new Entry(target, source, permissions).addToStorage(storage);
			}
		}

		/**
		 * private method which handles removals
		 * @param {String} target
		 * @param {Entry[]} storage
		 * @param {Array} permissions
		 * @param {String} source
		 */
		function removeEntryOrUpdatePermissions(target, storage, permissions, source) {
			//remove when no permissions left

			var entry = _.find(storage, {target: target, source: source});
			if (entry) {
				entry.removePermissions(permissions);
				entry.removeFromStorageWhenEmpty(storage);
			}
		}

		_.extend(
			exports,
			{
				grant: grant,
				revoke: revoke
			}
		);
	}
));