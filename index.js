"use strict";
/**
 * Node runtime.
 */
var path                = require('path');
var fs                  = require('fs');
var getCallsiteDirname  = require('get-callsite-dirname');
var resolve             = require('resolve/lib/sync');
var isString            = require('lodash').isString;

/**
 * Create a new assets registry.
 */
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


/**
 * Help from getting registry out of options.
 *
 * Works as follows:
 *
 *  - check if options.registry is already here
 *    - if it's a string, interpret as filename
 *    - otherwise return
 *  - check if options.prefix or options.root is available and create a new
 *    registry with these parameters
 *  - otherwise return global registry
 *
 * XXX: We can make it more useful (like returning the same registry when we get
 * the same args).
 */
function getRegistry(options) {
  if (options.registry) {
    return isString(options.registry) ? fromFilename(options.registry) : options.registry;
  } else if (options.prefix || options.root) {
    return createRegistry(options);
  } else {
    return process.__requireStaticRegistry;
  }
}

/**
 * Construct a new registry from a JSON object.
 */
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

/**
 * Construct a new registry by reading it from filesystem.
 */
function fromFilename(filename, options) {
  var data = fs.readFileSync(filename, 'utf8');
  return fromJSON(data);
}

/**
 * Configure a new global registry.
 */
function configure(options) {
  process.__requireStaticRegistry = options.requireAssets && options.urlToFilename ?
    options : createRegistry(options);
}

/**
 * Initialize registry on process so even if app includes several versions of 
 * require-assets we still have a single registry.
 *
 * TODO: If registry already exists check its version and throw on major version
 * incompatibility.
 */
if (!process.__requireStaticRegistry) {
  var registry = process.__requireStaticRegistry = createRegistry();
}

function requireAssets(id, basedir) {
  return process.__requireStaticRegistry.requireAssets(id, basedir);
};

function currentRegistry() {
  return process.__requireStaticRegistry;
}

module.exports = requireAssets;
module.exports.requireAssets = requireAssets;
module.exports.currentRegistry = currentRegistry;

module.exports.getRegistry = getRegistry;
module.exports.configure = configure
module.exports.createRegistry = createRegistry;
module.exports.fromJSON = fromJSON;
module.exports.fromFilename = fromFilename;
