var assert = require('assert')
var path = require('path')

var multiBundle = require('wzrd-api-client/multi')
var createCache = require('browser-module-cache')
var detective = require('detective')
var each = require('each-async')
var semver = require('semver')
var xtend = require('xtend')

module.exports = function createBundler (options) {
  options = options || {}
  var host = options.host || 'https://wzrd.in'
  // TODO: cache modules with valid semver
  options.cache = options.cache || {}
  var cache = createCache(options.cache)

  function bundler (entry, versions, callback) {
    versions = versions || {}
    var modules = detective(entry)
    if (!modules.length) return callback(null, entry, {})

    createPackages(modules, versions, function (err, allBundles, packages) {
      if (err) return callback(err)
      allBundles = allBundles + entry
      callback(null, allBundles, packages)
    })
  }

  bundler.cache = cache
  return bundler

  function createPackages (modules, versions, callback) {
    var allBundles = ''
    var packages = {}
    var download = {}

    each(modules, eachModule, function (err) {
      if (err) return callback(err)
      if (Object.keys(download).length > 0) {
        multiBundle({ dependencies: download, host: host }, function (err, res, body) {
          packages = xtend(packages, body)
          Object.keys(packages).forEach(function (key) {
            var pkg = packages[key]
            allBundles = allBundles + pkg.bundle
          })
          callback(null, allBundles, packages)
        })
      } else {
        callback(null, allBundles, packages)
      }
    })

    function eachModule (name, i, next) {
      var version = versions[name]
      packages[name] = { package: {} }

      if (typeof version === 'object' && version.pipeline) {
        version.pipeline.on('package', function (pkg) {
          packages[name].package = pkg
        })

        version.bundle(function (err, bundle) {
          packages[name].bundle = bundle.toString()
          allBundles = allBundles + 'require=' + packages[name].bundle
          next()
        })
      } else if (typeof version === 'object' && version.bundle) {
        packages[name] = version
        allBundles = allBundles + packages[name].bundle
        next()
      } else if (semver.valid(version)) {
        download[name] = version
        next()
      } else {
        download[name] = 'latest'
        next()
      }
    }
  }
}
