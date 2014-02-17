"use strict";

var assert        = require('assert');
var requireAssets = require('../index');

describe('require-assets', function() {

  beforeEach(function() {
    requireAssets.configureRegistry(requireAssets.createRegistry());
  });

  it('adds a mapping to registry on requireAssets(...) call', function() {
    var registry = requireAssets.currentRegistry();
    var url = requireAssets('./index.js');
    assert.equal(url, 'specs/index.js');
    var asset = registry.mapping[url];
    assert.ok(asset);

    assert.ok(asset.result);
    assert.equal(asset.result, 'specs/index.js');

    assert.ok(asset.filename);
    assert.equal(asset.filename, require.resolve('./index.js'));
  });

  it('can be serialized to JSON and restored back', function() {
    var registry = requireAssets.currentRegistry();
    var url = requireAssets('./index.js');
    assert.equal(url, 'specs/index.js');

    registry = requireAssets.fromJSON(JSON.stringify(registry));
    var asset = registry.mapping[url];
    assert.ok(asset.result);
    assert.equal(asset.result, 'specs/index.js');

    assert.ok(asset.filename);
    assert.equal(asset.filename, require.resolve('./index.js'));
  });

  describe('registry with custom handlers', function() {

    beforeEach(function() {
      requireAssets.configureRegistry(requireAssets.createRegistry({
        handlers: {
          js: function(filename, url, registry) {
            return {filename: filename, ok: true, result: url};
          }
        }
      }));
    });

    it('adds a mapping to registry on requireAssets(...) call', function() {
      var registry = requireAssets.currentRegistry();
      var url = requireAssets('./index.js');
      assert.equal(url, 'specs/index.js');
      var asset = registry.mapping[url];
      assert.ok(asset);
      assert.ok(asset.filename);
      assert.ok(asset.ok);
      assert.equal(asset.filename, require.resolve('./index.js'));
    });

  });


  describe('handling CSS assets', function() {

    it('handles CSS assets by transforming its source', function() {
      var registry = requireAssets.currentRegistry();
      var url = requireAssets('./fixtures/styles.css');
      assert.equal(url, 'specs/fixtures/styles.css');
      var asset = registry.mapping[url];
      assert.ok(asset);
      assert.ok(asset.filename);
      assert.equal(asset.filename, require.resolve('./fixtures/styles.css'));
      assert.ok(asset.src);

      assert.ok(registry.mapping['specs/fixtures/helpers.css']);
      assert.ok(registry.mapping['specs/fixtures/image.png']);
    });
  });
});
