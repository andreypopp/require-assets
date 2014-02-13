var requireAssets = require('../index');

var image = requireAssets('./image.png');
console.log(image);

if (typeof window !== 'undefined') {
  window.onload = function() {
    var img = document.createElement('img');
    img.src = image;
    document.body.appendChild(img);
  }
}
