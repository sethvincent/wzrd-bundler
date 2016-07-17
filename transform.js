var path = require('path')
var through = require('through2')
var staticModule = require('static-module')

var localBundleStream = require('./local-bundle-stream')

module.exports = function wzrdBundlerTransform (filename) {
  if (/\.json$/.test(filename)) return through()
  var basedir = path.dirname(filename)

  var vars = {
    __filename: filename,
    __dirname: basedir
  }

  var sm = staticModule({
    'wzrd-bundler/local-module': function (moduleName, options) {
      return localBundleStream(moduleName, options)
    }
  }, { vars: vars, varModules: { path: path } })

  return sm
}
