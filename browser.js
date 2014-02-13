"use strict";

module.exports = function() {
  throw new Error(
    "you should use require-assets/browserify plugin instead:\n" +
    "browserify -p [ require-assets/browserify --output ./map.json ] ..."
  );
};
