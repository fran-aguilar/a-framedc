
var path = require('path');
var webpack = require('webpack');
var minimizeOpt = process.argv.indexOf('--optimize-minimize') !== -1;


module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: minimizeOpt ? 'a-framedc.min.js' : 'a-framedc.js',
        libraryTarget: 'window',
        library: 'a-framedc'
    }
};
if (minimizeOpt) {
    module.exports.plugins = [];
    module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin());
}
