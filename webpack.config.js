const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    'dzhyun-token': './src/DzhyunTokenManager.js',
    'dzhyun-token.min': './src/DzhyunTokenManager.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'DzhyunTokenManager',
    libraryTarget: 'umd',
  },
  externals: {
    "dzhyun-connection": {
      commonjs: 'dzhyun-connection',
      commonjs2: 'dzhyun-connection',
      amd: 'dzhyun-connection',
      root: 'connection',
    },
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader",
    }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    }),
  ],
  devtool: 'source-map'
};
