var path = require('path')
var test = require('tape')
var browserify = require('browserify')

var createBundler = require('../index')
var transform = require('../transform')
var local = require('../local-module')

test('bundle local & remote dependencies', function (t) {
  var bundler = createBundler()

  var entry = `
    var bunny = require('bunny')
    var resl = require('resl')
    var regl = require('regl')
  `

  var versions = {
    regl: local('regl'),
    resl: local('resl')
  }

  bundler(entry, versions, function (err, bundle, packages) {
    t.notOk(err)
    t.ok(bundle)
    t.ok(packages)
    t.ok(packages.regl)
    t.ok(packages.resl)
    t.ok(packages.bunny)
    t.ok(packages.regl.package)
    t.ok(packages.resl.package)
    t.ok(packages.bunny.package)
    t.ok(packages.regl.bundle)
    t.ok(packages.resl.bundle)
    t.ok(packages.bunny.bundle)
    t.end()
  })
})

test('browserify transform for bundling local modules', function (t) {
  var b = browserify(path.join(__dirname, 'example.js'))
    b.on('error', console.log)
    b.transform(require('../transform'))
    b.bundle(function (err, buf) {
      t.notOk(err)
      t.ok(buf)
      t.end()
    })
})
