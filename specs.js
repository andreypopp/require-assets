"use strict";

var assert        = require('assert');
var requireAssets = require('./index');

describe('require-assets', function() {

  beforeEach(function() {
    requireAssets.configureRegistry(requireAssets.createRegistry());
  });

  it('adds a mapping to registry on requireAssets(...) call', function() {
    var registry = requireAssets.currentRegistry();
    var url = requireAssets('./specs.js');
    assert.equal(url, '/assets/specs.js');
    var asset = registry.mapping[url];
    assert.ok(asset);
    assert.ok(asset.filename);
    assert.equal(asset.filename, require.resolve('./specs.js'));
  });

  describe('registry with custom handlers', function() {

    beforeEach(function() {
      requireAssets.configureRegistry(requireAssets.createRegistry({
        handlers: {
          js: function(filename, url, registry) {
            return {filename: filename, ok: true};
          }
        }
      }));
    });

    it('adds a mapping to registry on requireAssets(...) call', function() {
      var registry = requireAssets.currentRegistry();
      var url = requireAssets('./specs.js');
      assert.equal(url, '/assets/specs.js');
      var asset = registry.mapping[url];
      assert.ok(asset);
      assert.ok(asset.filename);
      assert.ok(asset.ok);
      assert.equal(asset.filename, require.resolve('./specs.js'));
    });
  });
});
