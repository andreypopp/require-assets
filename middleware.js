"use strict";
/**
 * Middleware for connect/express.
 */

var fs = require('fs');

/**
 * Construct a connect/express middleware to server static assets to a browser
 *
 * @param {Registry?} registry A registry to use for serving assets, if not
 *                    passed then the global instance will be used.
 */
function makeServeStatic(registry) {
  registry = registry || require('./index').registry;
  return function serveStatic(req, res, next) {
    var filename = registry.urlToFilename[req.originalUrl];
    if (!filename) return next();
    // XXX: sendfile?!
    fs.createReadStream(filename).pipe(res);
  }
}

module.exports = makeServeStatic;
