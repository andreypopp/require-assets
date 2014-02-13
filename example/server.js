var pathTo        = require('path').join.bind(null, __dirname)
var express       = require('express')

var requireAssets = require('../index')
var serve         = require('../middleware')

// you created this by running browserify or xcss over the sources
var registry = requireAssets.fromFilename('./assets.json')

express()
  .use(serve(registry))
  .use(express.static(__dirname))
  .listen(3000, function() {
    console.log('point your browser at http://localhost:3000')
  });
