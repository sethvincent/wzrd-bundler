# wzrd-bundler

## Usage

```js
var createBundler = require('wzrd-bundler')

var bundler = createBundler({
  host: 'https://wzrd.in'
})

var code = `var bunny = require('bunny')`

var versions = {
  bunny: '1.0.1'
}

bundler(code, versions, function (err, bundle, packages) {
  // bundle is all bundled modules as a string
  // packages is an object with package information about all bundled modules
})
```

## WIP: Using local module overrides

**WORK IN PROGRESS**

Instead of specifying `latest` or a specific version of a module, you can instead use the `bundler.localModule()` method to force the bundler to use your local version of a module in the browser bundle. This is important for debugging, or overriding the behavior of modules for demo purposes.

It is *required* to use the built in browserify transform module in order to bundle this code for the browser.

```js
var createBundler = require('wzrd-bundler')
var local = require('wzrd-bundler/local-module')

var bundler = createBundler({
  host: 'https://wzrd.in'
})

var code = `var bunny = require('bunny')`

var versions = {
  bunny: local('./bunny')
}

bundler(code, versions, function (err, bundle, packages) {
  // bundle is all bundled modules as a string
  // packages is an object with package information about all bundled modules
  // local packages are given the version `local`
})
```

### Using the browserify transform

Example of using the wzrd-bundler transform:

```
browserify index.js -t wzrd-bundler/transform -o bundle.js
```

## License
[MIT](LICENSE.md)
