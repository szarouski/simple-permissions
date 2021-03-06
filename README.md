# Simple Permissions

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/szarouski/simple-permissions?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)  
Trivial permissions implementation with following features
- Many to many permissions (if you need one to many it is very easy to write some sort of wrapper)
- Crossbrowser/Crossplatform
- tested with ~100% coverage

Dependencies
- Lodash

License
- http://unlicense.org/

________

## Installation:

`bower install simple-permissions`  
`npm install simple-permissions`

## Tests:

To launch tests you have to run `npm install` then `npm test`.
If you want to contribute make sure to run `grunt githooks` first thing after clone. 
It will create pre-commit hook and run tests and jshint before you commit. 
Please use git flow - create a feature branch for your feature and send a pull request to dev. 
Please don't include _dist_ folder in your commit.

## API:

```js
/**
 * @typedef {{target: String, source: String, permissions: Array}} SimplePermissions
 */

/**
 * Create/append permissions in a storage
 * @param {SimplePermissions[]} storage
 * @param {String|Array} to
 * @param {Object} permissionsMap
 */
function grant(storage, to, permissionsMap) {}

/**
 * Reduce/Remove permissions in a storage
 * @param {SimplePermissions[]} storage
 * @param {String|Array} from
 * @param {Object} permissionsMap
 */
function revoke(storage, from, permissionsMap) {}
```

## Examples:

```js
//one to many

var app = (function () {
	var permissions = [];

	return {
		permissions: permissions,
		grant: _.partial(grant, permissions, 'App'),
		revoke: _.partial(revoke, permissions, 'App')
	};
})();

app.grant({Admin: ['Read', 'Write', 'Email', 'Users'], User: ['Write', 'Read']});
console.log(_.map(app.permissions, function (entry) {
	return entry.source + ' - ' + entry.permissions.join(',')
}));
//["Admin - Read,Write,Email,Users", "User - Write,Read"]

app.revoke({User: ['Write']});
console.log(_.map(app.permissions, function (entry) {
	return entry.source + ' - ' + entry.permissions.join(',')
}));
//["Admin - Read,Write,Email,Users", "User - Read"]
```

```js
//starting code
var Foo = {
		name: 'Foo',
		storage: []
	},
	s = Foo.storage;

///////////////////
// grant example //
///////////////////

//basic case
var str = 'whatever';
grant(s, Foo.name, {Bar: [str]});
var entry = _(s).find({target: Foo.name, source: 'Bar'});
//s.length === 1;
//entry.permissions[0] === str;

//works with multiple targets
var str = 'whatever';
grant(s, ['Bar', 'Baz', 'Qux'], {Foo: [str]});
var results = [
	_(s).find({target: 'Bar', source: Foo.name}),
	_(s).find({target: 'Baz', source: Foo.name}),
	_(s).find({target: 'Qux', source: Foo.name})
];
//s.length === 4;
//_.each(results, function (result) {
//	result.permissions[0] === str;
//});

//works with multiple permission rules
var str1 = 'anything';
var str2 = 'something else';
grant(s, 'Bar', {Foo: [str1], Baz: [str2]});
var result1 = _(s).find({target: 'Bar', source: Foo.name});
var result2 = _(s).find({target: 'Bar', source: 'Baz'});
//s.length === 5;
//result1.permissions[1] === str1;
//result2.permissions[0] === str2;

////////////////////
// revoke example //
////////////////////

//basic case
revoke(s, 'Foo', {Bar: ['whatever']});
//s.length === 4;
//_(s).find({target: Foo.name, source: 'Bar'}) === undefined;

//works with multiple permission rules
revoke(s, 'Bar', {Foo: ['anything'], Baz: ['something else']});
//s.length === 3
//_(s).find({target: 'Bar', source: Foo.name}).permissions[0] === 'whatever';
//_(s).find({target: 'Bar', source: 'Baz'}) === undefined;


// works with multiple targets
revoke(s, ['Bar', 'Baz', 'Qux'], {Foo: ['whatever']});
//s.length === 0
```

[![Analytics](https://ga-beacon.appspot.com/UA-61501696-1/szarouski/simple-permissions/README)](https://github.com/igrigorik/ga-beacon)
