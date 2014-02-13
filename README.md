# require-assets

An approach to package and re-use static assets. The idea is to resolve
references to static assets across a codebase to URLs.

[module id]: http://nodejs.org/api/modules.html#modules_file_modules

## Installation

Install via npm:

    % npm install git+https://github.com/andreypopp/require-assets.git

## Example app

Directory `./example` in the repository contains an example application, run it
with:

    % make install example

## Concepts

The library exports a single function `requireAssets(...)`. It accepts an asset
[module id][] and returns a corresponding URL.

Internally it maintains a registry — a mapping from URLs to filenames. Later you
can use this registry to setup a server (or deploy on CDN) and serve required
files under expected URLs.

## Extracting asset registry from code

When referencing assets from JavaScript runtime, you'd need to import
`require-assets` under `requireAssets` identifier:

    var requireAssets = require('require-assets')

Then you can use it to get the URL of the needed static assets (an example uses
[React][] library):

    var Spinner = React.createClass({

      render: function() {
        return <img src={requireAssets('./spinner.gif')} />
      }
    })

If code executes on server (Node.js) then you will be able to access the
registry via `requireAssets.registry`.

Otherwise you'd need to extract the registry from your JavaScript code. Library
provides `require-assets/browserify` transform for browserify which helps with
that:

    % browserify -p [ require-assets/browserify --output ./assets.json ] ...

## Extracting asset registry from stylesheets

It is also useful to be able to reference assets (such as fonts, images, ...)
from stylesheets.

If you are happen to use [xcss][], it is quite straightforward:

    @require "require-assets/url" as url

    .Component {
      background-image: url(./spinner.gif)
    }

THe library includes transform for [xcss][] transforms which resolves arguments
of `url(...)` calls and builds an asset registry from that:

    % xcss -t [ require-assets/xcss --output ./assets.json ] ...

## Serving assets with connect/express middleware

The library includes basic connect/request middleware to serve asset registry to a
browser:

    var app           = require('express');
    var requireAssets = require('require-assets');
    var serve         = require('require-assets/middleware');

    // you created this by running browserify or xcss over the sources
    var registry = requireAssets.fromFilename('./assets.json');

    app
      .use(serve(registry))
      .listen(3000);

## Serving static assets with nginx

TODO

## Serving static assets with CDN

TODO

[React]: http://facebook.github.io/react
[xcss]: https://github.com/andreypopp/xcss
