"use strict";
/**
 * Browser runtime.
 *
 * All asset references in client side code should be extracted before serving
 * to browser. So this just throws an error. See require-assets-browserify for
 * the way to extract assets from client side code.
 */

module.exports = function() {
  throw new Error(
    "you should use require-assets-browserify plugin instead:\n" +
    "browserify -p [ require-assets-browserify --output ./map.json ] ..."
  );
};
