"use strict";

var requireAssets       = require('./index');
var getCallsiteDirname  = require('get-callsite-dirname');

/**
 * Same as requireAssets(...) but wraps returned URL into url() so it is useful
 * for CSS collectors.
 */
function url(id) {
  var basedir = getCallsiteDirname();
  return 'url(' + requireAssets(id, basedir) + ')';
}

module.exports = url;
