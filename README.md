# require-assets

Require static assets.

## Installation

Install via npm:

    % npm install git+https://github.com/andreypopp/require-assets.git

## Usage

    var requireAssets = require('require-assets');

    // requireAssets(..) resolves asset id to a URL
    var bootstrapURL = requireAssets('bootstrap/dist/css/bootstrap.css');

    // inject stylesheet into the document
    addStylesheet(bootstrapURL);

    function addStylesheet(href) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
