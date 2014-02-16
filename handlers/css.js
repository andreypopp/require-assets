"use strict";

var path  = require('path');
var fs    = require('fs');

function handleCSS(filename, url, registry) {
  var asset = {filename: filename, result: url};

  var basedir = path.dirname(filename);

  asset.src = fs.readFileSync(filename, 'utf8').replace(
    /([^a-zA-Z0-9])url\(([^\)]+)\)/g, function(_m, prefix, ref) {
      ref = ref
        .replace(/^'/, '').replace(/'$/, '')
        .replace(/^"/, '').replace(/"$/, '');

      var suffix = '';
      ref = ref.replace(/[\?#].+$/, function(m) {
        suffix = m;
        return '';
      });

      var result = registry.requireAssets(ref, basedir);
      return prefix + 'url(' + result + suffix + ')';
    });

  return asset;
}

module.exports = handleCSS;
