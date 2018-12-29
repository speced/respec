const path = require("path");
const webpack = require('webpack');

module.exports = {
  mode: "production",
  entry: "./js/profile-w3c-common.js",
  output: {
    path: path.resolve(__dirname, "builds"),
    filename: "respec-w3c-common.js"
  },
  module: {
    rules: [
      {
        // shortcut.js uses global scope
        test: require.resolve('./js/shortcut.js'),
        use: 'exports-loader?shortcut'
      }
    ]
  },
  resolveLoader: {
    // to import texts via e.g. "text!./css/webidl.css"
    alias: { "text": "raw-loader" }
  },
  devtool: 'source-map'
}
