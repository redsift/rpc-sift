'use strict';

var webpack = require('webpack'),
  path = require('path');

var siftRootPath = path.resolve('../');

module.exports = {
  cache: true,
  devtool: 'source-map',
  entry: {
		controller: [ 'babel-polyfill', './src/scripts/controller.js'],
		view: [ 'babel-polyfill', './src/scripts/view.js'],
	},
  output: {
		filename: '[name].umd-es2015.min.js',
		path: path.join(__dirname, 'public', 'dist', 'js'),
	},
  resolve: {
    // modules: ['node_modules'],
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader?cacheDirectory',
          options: {
            presets: [
              require.resolve('babel-preset-es2015'),
              require.resolve('babel-preset-es2017'),
            ]
          }
        }
      },
    ],
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  }
};
