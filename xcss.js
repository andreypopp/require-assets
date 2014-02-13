"use strict";

var fs            = require('fs');
var requireAssets = require('./index');

module.exports = function(stylesheet, options) {
  var output = options && (options.o || options.output);
  var registry = requireAssets.getRegistry(options);

  if (!output) {
    throw new Error(
      'provide output for require-assets/browserify: ' +
      'xcss -t [ require-assets/xcss --output ./url-filename.json ] ...');
  }

  fs.writeFileSync(output, JSON.stringify(registry));

  return stylesheet;
};
