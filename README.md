# Simple Permissions
Trivial permissions implementation with following features
- Many to many permissions (if you need one to many it is very easy to write some sort of wrapper)
- Crossbrowser/Crossplatform
- tested with ~100% coverage

Dependencies
- Lodash

License
- http://unlicense.org/

________
##Installation:
bower `bower install simple-permissions`  
npm `npm install simple-permissions`

##Tests:
To launch tests make sure you have `karma-cli` installed globally and run `npm install`.  
In browsers run `npm test` (you might want to adjust karma.conf.js). In node `npm run test-node`.

If you want to contribute make sure you have `grunt-cli` installed globally and run `grunt`. Please don't include _dist_ folder in your commit.

##API:
```js
/**
 * @typedef {{target: String, source: String, properties: Array}} Entry
 */

/**
 * Create/append permissions in a storage
 * @param {Entry[]} storage
 * @param {String|Array} to
 * @param {Object} permissions
 */
function grant(storage, to, permissions) {}

/**
 * Reduce/Remove permissions in a storage
 * @param {Entry[]} storage
 * @param {String|Array} from
 * @param {Object} permissions
 */
function revoke(storage, from, permissions) {}
```

##Examples:
```js
//one to many

var app = (function () {
	var permissions = [];

	return {
		permissions: permissions,
		grant: _.partial(permissionsExports.grant, permissions, 'App'),
		revoke: _.partial(permissionsExports.revoke, permissions, 'App')
	};
})();

app.grant({Admin: ['Read', 'Write', 'Email', 'Users'], User: ['Write', 'Read']});
console.log(_.map(app.permissions, function (permissions) {
	return permissions.source + ' - ' + permissions.properties.join(',')
}));
//["Admin - Read,Write,Email,Users", "User - Write,Read"]

app.revoke({User: ['Read']});
console.log(_.map(app.permissions, function (permissions) {
	return permissions.source + ' - ' + permissions.properties.join(',')
}));
//["Admin - Read,Write,Email,Users", "User - Write"]
```

```js
//starting code
var Pa = {
		name: 'Pa',
		storage: []
	},
	s = Pa.storage;

///////////////////
// grant example //
///////////////////

//basic case
var str = 'whatever';
grant(s, Pa.name, {So: [str]});
var entry = _(s).find({target: Pa.name, source: 'So'});
//s.length === 1;
//entry.properties[0] === str;

//works with multiple targets
var str = 'whatever';
grant(s, ['So', 'Do', 'Go'], {Pa: [str]});
var results = [
	_(s).find({target: 'So', source: Pa.name}),
	_(s).find({target: 'Do', source: Pa.name}),
	_(s).find({target: 'Go', source: Pa.name})
];
//s.length === 4;
//_.each(results, function (result) {
//	result.properties[0] === str;
//});

//works with multiple permission rules
var str1 = 'anything';
var str2 = 'something else';
grant(s, 'So', {Pa: [str1], Do: [str2]});
var result1 = _(s).find({target: 'So', source: Pa.name});
var result2 = _(s).find({target: 'So', source: 'Do'});
//s.length === 5;
//result1.properties[1] === str1;
//result2.properties[0] === str2;

////////////////////
// revoke example //
////////////////////

//basic case
revoke(s, 'Pa', {So: ['whatever']});
//s.length === 4;
//_(s).find({target: Pa.name, source: 'So'}) === undefined;

//works with multiple properties
revoke(s, 'So', {Pa: ['anything'], Do: ['something else']});
//s.length === 3
//_(s).find({target: 'So', source: Pa.name}).properties[0] === 'whatever';
//_(s).find({target: 'So', source: 'Do'}) === undefined;


// works with multiple permission rules
revoke(s, ['So', 'Do', 'Go'], {Pa: ['whatever']});
//s.length === 0
```