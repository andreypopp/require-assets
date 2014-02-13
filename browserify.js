"use strict";

var fs            = require('fs');
var through       = require('through');
var path          = require('path');
var resolve       = require('resolve/lib/sync');
var isString      = require('lodash').isString;
var createMiner   = require('mine').createMiner;
var requireAssets = require('./index');

var IDENTIFIER  = 'requireAssets';
var miner       = createMiner(IDENTIFIER);

module.exports = function(b, options) {
  if (typeof b.bundle === 'function' && typeof b.transform === 'function') {
    return plugin(b, options);
  } else {
    return transform(b, options);
  }
}

function plugin(b, options) {
  var output = options && (options.o || options.output);

  if (!output) {
    throw new Error(
      'provide output for require-assets/browserify: ' +
      'browserify -p [ require-assets/browserify --output ./url-filename.json ] ...');
  }

  var registry = requireAssets.getRegistry(options);

  b.transform(transform);

  b.on('bundle', function(stream) {
    stream.on('end', function() {
      fs.writeFile(output, JSON.stringify(registry.urlToFilename), function(err) {
        if (err) stream.emit('error', err);
      });
    });
  });

  return b;
}

function transform(filename, options) {
  options = options || {};

  var registry = requireAssets.getRegistry(options);

  var src = '';
  var basedir = path.dirname(filename);

  return through(
    function(c) { src += c; },
    function() {
      var mined = miner(src);

      for (var i = mined.length - 1; i >= 0; i--) {
        var item = mined[i];

        var filename = resolve(item.name, {basedir: basedir});
        var url = registry.makeURL(filename);

        // splice string
        var start = item.offset - IDENTIFIER.length - 2;
        var end = item.offset + item.name.length + 2;
        src = src.substring(0, start) + JSON.stringify(url) + src.substring(end);
      }
      this.queue(src);
      this.queue(null);
    });
}
