"use strict";

var path                = require('path');
var fs                  = require('fs');
var getCallsiteDirname  = require('get-callsite-dirname');
var resolve             = require('resolve/lib/sync');
var isString            = require('lodash').isString;

function createRegistry(options) {
  options = options || {};

  var registry = {
    root: options.root || process.cwd(),
    prefix: options.prefix || process.env.REQUIRE_STATIC_PREFIX || '/assets/',

    urlToFilename: {},

    filenameToUrl: {},

    toJSON: function() {
      return registry.urlToFilename;
    },

    makeURL: function(filename) {
      var url = path.join(registry.prefix, path.relative(registry.root, filename));
      registry.urlToFilename[url] = filename;
      registry.filenameToUrl[filename] = url;
      return url
    },

    requireAssets: function(id, basedir) {
      basedir = basedir || getCallsiteDirname();
      var filename = resolve(id, {basedir: basedir});
      return registry.makeURL(filename);
    }
  };
  return registry;
}

// XXX: We can make it more useful (like returning the same registry when we get
// the same args).
function getRegistry(options) {
  if (options.prefix || options.root) {
    return createRegistry(options);
  } else if (options.registry) {
    return isString(options.registry) ? fromFilename(options.registry) : options.registry;
  } else {
    return process.__requireStaticRegistry;
  }
}

function fromJSON(data, options) {
  if (isString(data))
    data = JSON.parse(data);
  var registry = createRegistry(options);
  for (var k in data) {
    registry.urlToFilename[k] = data[k];
    registry.filenameToUrl[data[k]] = k;
  }
  return registry;
}

function fromFilename(filename, options) {
  var data = fs.readFileSync(filename, 'utf8');
  return fromJSON(data);
}

function configure(options) {
  process.__requireStaticRegistry = createRegistry(options);
}

function configureFromJSON(data, options) {
  process.__requireStaticRegistry = fromJSON(data, options);
}

function configureFromFilename(filename, options) {
  process.__requireStaticRegistry = fromFilename(filename, options);
}

if (!process.__requireStaticRegistry) {
  process.__requireStaticRegistry = createRegistry();
}

module.exports = process.__requireStaticRegistry.requireAssets;
module.exports.requireAssets = process.__requireStaticRegistry.requireAssets;
module.exports.registry = process.__requireStaticRegistry;

module.exports.fromJSON = fromJSON;
module.exports.fromFilename = fromFilename;

module.exports.configure = configure
module.exports.configureFromJSON = configureFromJSON;
module.exports.configureFromFilename = configureFromFilename;

module.exports.getRegistry = getRegistry;
