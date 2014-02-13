"use strict";

var fs       = require('fs');

/**
 * Construct a connect/express middleware to server static assets to a browser
 */
function makeServeStatic(registry) {
  registry = registry || require('./index').registry;
  return function serveStatic(req, res, next) {
    var filename = registry.urlToFilename[req.originalUrl];
    if (!filename) return next();
    // XXX: sendfile?!
    fs.readFileStream(filename).pipe(res);
  }
}

module.exports = makeServeStatic;
