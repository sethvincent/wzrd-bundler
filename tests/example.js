var local = require('wzrd-bundler/local-module')
var createBundler = require('wzrd-bundler')
var makeIframe = require('make-iframe')
var bundler = createBundler()

var entry = `
  var choo = require('choo')
  var html = require('choo/html')
  var css = require('dom-css')
  var app = choo()
`

var versions = {
  choo: local('choo')
}

var container = document.createElement('div')
document.body.appendChild(container)

bundler(entry, versions, function (err, bundle, packages) {
  if (err) console.log(err)
  var iframe = makeIframe(bundle, {
    container: container,
    sandbox: ['allow-scripts']
  })
})
