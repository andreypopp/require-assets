"use strict";

var fs            = require('fs');
var through       = require('through');
var path          = require('path');
var resolve       = require('resolve/lib/sync');
var isString      = require('lodash').isString;
var requireAssets = require('./index');

var IDENTIFIER  = 'requireAssets';
var miner       = createMiner(IDENTIFIER);

module.exports = function(b, options) {
  if (typeof b.bundle === 'function' && typeof b.transform === 'function') {
    return plugin(b, options);
  } else {
    return transform(b, options);
  }
}

function plugin(b, options) {
  var output = options && (options.o || options.output);

  if (!output) {
    throw new Error(
      'provide output for require-assets/browserify: ' +
      'browserify -p [ require-assets/browserify --output ./url-filename.json ] ...');
  }

  var registry = requireAssets.getRegistry(options);

  b.transform(transform);

  b.on('bundle', function(stream) {
    stream.on('end', function() {
      fs.writeFile(output, JSON.stringify(registry.urlToFilename), function(err) {
        if (err) stream.emit('error', err);
      });
    });
  });

  return b;
}

function transform(filename, options) {
  options = options || {};

  var registry = requireAssets.getRegistry(options);

  console.warn(filename);
  if (/\.css$/.exec(filename) && options.css) {
    return transformCSS(filename, {registry: registry});
  }

  var src = '';
  var basedir = path.dirname(filename);

  return through(
    function(c) { src += c; },
    function() {
      var mined = miner(src);

      for (var i = mined.length - 1; i >= 0; i--) {
        var item = mined[i];

        var filename = resolve(item.name, {basedir: basedir});
        var url = registry.makeURL(filename);

        // splice string
        var start = item.offset - IDENTIFIER.length - 2;
        var end = item.offset + item.name.length + 2;
        src = src.substring(0, start) + JSON.stringify(url) + src.substring(end);
      }

      this.queue(src);
      this.queue(null);
    });
}

function transformCSS(filename, options) {
  options = options || {};

  var registry = requireAssets.getRegistry(options);

  var src = '';
  var basedir = path.dirname(filename);
  
  return through(
    function(c) { src += c; },
    function() { 
      // TODO: needs a better parser!
      var re = /url\(([^\)]+)\)/;
      var refs = [];
      var cur = src;
      var offset = 0;
      var m;

      while (cur && (m = cur.match(re))) {
        var start = m.index + offset;
        var end = start + m[0].length;
        refs.push({
          start: start,
          end: end,
          name: m[1].trim()
        });

        offset = offset + end - start;
        cur = cur.substring(m.index + m[0].length);
      }

      console.log(refs);

      this.queue(src);
      this.queue(null);
    });
}

function createMiner(mineFor) {
  // Mine a string for require calls and export the module names
  // Extract all require calls using a proper state-machine parser.
  // https://raw.github.com/creationix/js-linker/master/mine.js
  // TODO: Submit a PR instead of copypasting
  return function mine(js) {
    var names = [];
    var state = 0;
    var ident;
    var quote;
    var name;
    var start;

    var isIdent = /[a-z0-9_.]/i;
    var isWhitespace = /[ \r\n\t]/;

    function $start(char) {
      if (char === "/") {
        return $slash;
      }
      if (char === "'" || char === '"') {
        quote = char;
        return $string;
      }
      if (isIdent.test(char)) {
        ident = char;
        return $ident;
      }
      return $start;
    }

    function $ident(char) {
      if (isIdent.test(char)) {
        ident += char;
        return $ident;
      }
      if (char === "(" && ident === mineFor) {
        ident = undefined;
        return $call;
      }
      return $start(char);
    }

    function $call(char) {
      if (isWhitespace.test(char)) return $call;
      if (char === "'" || char === '"') {
        quote = char;
        name = "";
        start = i + 1;
        return $name;
      }
      return $start(char);
    }

    function $name(char) {
      if (char === quote) {
        return $close;
      }
      name += char;
      return $name;
    }

    function $close(char) {
      if (isWhitespace.test(char)) return $close;
      if (char === ")" || char === ',') {
        names.push({
          name: name,
          offset: start
        });
      }
      name = undefined;
      return $start(char);
    }

    function $string(char) {
      if (char === "\\") {
        return $escape;
      }
      if (char === quote) {
        return $start;
      }
      return $string;
    }

    function $escape(char) {
      return $string;
    }

    function $slash(char) {
      if (char === "/") return $lineComment;
      if (char === "*") return $multilineComment;
      return $start(char);
    }

    function $lineComment(char) {
      if (char === "\r" || char === "\n") return $start;
      return $lineComment;
    }

    function $multilineComment(char) {
      if (char === "*") return $multilineEnding;
      return $multilineComment;
    }

    function $multilineEnding(char) {
      if (char === "/") return $start;
      if (char === "*") return $multilineEnding;
      return $multilineComment;
    }

    var state = $start;
    for (var i = 0, l = js.length; i < l; i++) {
      state = state(js[i]);
    }

    return names;
  }
}
