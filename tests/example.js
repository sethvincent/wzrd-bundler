var local = require('wzrd-bundler/local-module')
var createBundler = require('wzrd-bundler')
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
  if (err) console.log(err)
  console.log(packages.regl.package)
  console.log(packages.resl.package)
  console.log(packages.bunny.package)
})
