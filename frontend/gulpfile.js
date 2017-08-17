'use strict';

const gulp = require('gulp');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

gulp.task('default', function(callback) {
  webpack(webpackConfig, function (err, stats) {
    if (err) throw err;
    console.log(stats.toString());
    callback();
  });
});
