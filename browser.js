"use strict";

module.exports = function() {
  throw new Error(
    "you should use require-static/browserify plugin instead:\n" +
    "browserify -p [ require-static/browserify --output ./map.json ] ..."
  );
};
