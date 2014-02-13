var requireAssets = require('../index');
var image = requireAssets('./image.png');
var image2 = "hello, " + requireAssets('./image.png');
console.log(image);
