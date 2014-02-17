"use strict";

var path                = require('path');
var fs                  = require('fs');
var getCallsiteDirname  = require('get-callsite-dirname');
var resolve             = require('resolve/lib/sync');
var isString            = require('lodash').isString;
var handleCSS           = require('./handlers/css');

function createRegistry(options) {
  options = options || {};

  var root = options.root || process.cwd();
  var prefix = options.prefix || process.env.REQUIRE_ASSETS_PREFIX || '';
  var handlers = options.handlers || {};

  if (!handlers.css)
    handlers.css = handleCSS;

  var registry = {
    mapping: {},

    handlers: handlers,
    root: root,
    prefix: prefix,

    toJSON: function() {
      return registry.mapping;
    },

    createURL: function(filename) {
      return path.join(registry.prefix, path.relative(registry.root, filename));
    },

    addMapping: function(filename, url) {
      url = url || registry.createURL(filename);
      var extname = path.extname(filename);
      var handler = registry.handlers[extname.slice(1)];

      return registry.mapping[url] = handler ?
        handler(filename, url, registry) :
        {filename: filename, result: url};
    },

    requireAssets: function(id, basedir) {
      basedir = basedir || getCallsiteDirname();
      var filename = resolve(id, {basedir: basedir});
      return registry.addMapping(filename).result;
    }
  };
  return registry;
}

function fromJSON(data, options) {
  if (isString(data))
    data = JSON.parse(data);
  var registry = createRegistry(options);
  registry.mapping = data;
  return registry;
}

function fromFile(filename, options) {
  var data = fs.readFileSync(filename, 'utf8');
  return fromJSON(data);
}

function requireAssets(id, basedir) {
  basedir = basedir || getCallsiteDirname();
  return process.__requireAssetsRegistry.requireAssets(id, basedir);
}

function configureRegistry(registry) {
  process.__requireAssetsRegistry = registry;
}

function currentRegistry() {
  return process.__requireAssetsRegistry;
}

if (!process.__requireAssetsRegistry) {
  process.__requireAssetsRegistry = createRegistry();
}

module.exports = requireAssets;
module.exports.requireAssets = requireAssets;

module.exports.currentRegistry = currentRegistry;
module.exports.configureRegistry = configureRegistry
module.exports.createRegistry = createRegistry;

module.exports.fromJSON = fromJSON;
module.exports.fromFile = fromFile;
