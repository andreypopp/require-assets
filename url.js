"use strict";

var requireAssets       = require('./index');
var getCallsiteDirname  = require('get-callsite-dirname');

function url(id) {
  var basedir = getCallsiteDirname();
  return 'url(' + requireAssets(id, basedir) + ')';
}

module.exports = url;
