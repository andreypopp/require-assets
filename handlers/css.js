"use strict";

var path  = require('path');
var fs    = require('fs');

function handleCSS(filename, url, registry) {
  var asset = {filename: filename, result: url};

  var basedir = path.dirname(filename);

  asset.src = fs.readFileSync(filename, 'utf8').replace(
    /([^a-zA-Z0-9])url\(([^\)]+)\)/g, function(_m, prefix, ref) {
      var result = registry.requireAssets(ref, basedir);
      return prefix + 'url(' + result + ')';
    });

  return asset;
}

module.exports = handleCSS;
