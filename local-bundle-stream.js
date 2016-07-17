var resolve = require('browser-resolve')
var browserify = require('browserify')
var through = require('through2')

module.exports = function localBundleStream (moduleName, options) {
  options = options || {}
  options.debug = true
  var filepath = resolve.sync(moduleName)
  var b = browserify(options)
  b.require(filepath, { expose: moduleName })
  var stream = through()
  stream.push('{')

  var first = true
  b.on('package', function (pkg) {
    if (first) stream.push('package: ' + JSON.stringify(pkg) + ',')
    first = false
  })

  b.bundle(function (err, bundle) {
    if (err) return console.log(err)
    stream.push('bundle: ' + JSON.stringify('require=' + bundle.toString()) + '\n}')
    stream.push(null)
  })

  return stream
}
