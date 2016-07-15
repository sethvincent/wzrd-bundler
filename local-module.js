var browserify = require('browserify')
var resolve = require('browser-resolve')

module.exports = function localModule (moduleName, options) {
  options = options || {}
  options.standalone = moduleName
  var filepath = resolve.sync(moduleName)
  return browserify(filepath, options)
}
