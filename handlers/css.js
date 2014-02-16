"use strict";

var path  = require('path');
var fs    = require('fs');

function handleCSS(filename, url, registry) {
  var asset = {filename: filename, result: url};

  var basedir = path.dirname(filename);

  var src = fs.readFileSync(filename, 'utf8');

  src = src.replace(
    /([^a-zA-Z0-9])url\(([^\)]+)\)/g,
    function(_m, prefix, ref) {
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

  src = src.replace(
    /# sourceMappingURL=([^ $\*]+)/,
    function(_m, ref) {
      if (ref[0] !== '.')
        ref = './' + ref;
      var result = registry.requireAssets(ref, basedir);
      return '# sourceMappingURL=' + result;
    });

  asset.src = src;

  return asset;
}

module.exports = handleCSS;
