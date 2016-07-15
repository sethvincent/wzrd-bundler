var request = require('xhr')

request('http://boundaries.seattle.io/boundaries', function (err, res, body) {
  console.log(body)
})
