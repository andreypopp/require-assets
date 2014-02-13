# require-assets

An approach to package and reuse static assets in your application. The idea is
to resolve references to static assets across your code and stylesheets to URLs.

## Installation

As usual, via npm:

    % npm install git+https://github.com/andreypopp/require-assets.git

It's not yet released, so pull from a repository.

## Extracting assets from client code with browserify

You can get references to assets by using `requireAssets(...)` function which works
similar to CommonJS's `require(..)` but returns URLs of the assets instead of
its contents:

    var requireAssets = require('require-assets');

    var image = require('./image.png');
    console.log(image) // prints an URL

    % browserify -p [ require-assets/browserify --output ./assets.json ] ...

## Extracting assets from server code

If you are happy [React][react] user you probably would want to pre-render UI on
server. You can have all URLs to your assets pointing to the right locations
still by using exactly the same code as above:

    var requireAssets = require('require-assets');

    var image = require('./image.png');
    console.log(image) // prints an URL, something like /assets/image.png

You can access assets registry in memory via `requireAssets.registry`.

## Extracting assets from stylesheets with xcss

    % xcss -t [ require-assets/xcss --output ./assets.json ] ...

## Serving assets with connect/express middleware

Library includes basic connect/request middleware to serve asset registry to a
browser:

    var app   = require('express');
    var requireAssets = require('require-assets');
    var serve = require('require-assets/middleware');

    // previously you created this by running browserify or xcss over the
    // sources
    var registry = requireAssets.fromFilename('./assets.json');

    app
      .use(serve(registry))
      .listen(3000);

## Configuration

## Serving static assets with nginx

TODO

## Serving static assets with CDN

TODO

[react]: http://facebook.github.io/react
