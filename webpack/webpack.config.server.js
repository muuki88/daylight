import webpack from 'webpack';
import path from 'path';
import fs from 'fs';

/* --------------
see see http://jlongster.com/Backend-Apps-with-Webpack--Part-I

But there is a problem. Webpack will load modules from the node_modules folder and bundle them in. This is fine for frontend code, but backend modules typically aren't prepared for this (i.e. using require in weird ways) or even worse are binary dependencies. We simply don't want to bundle in anything from node_modules.
-------------- */
let nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

export default {
  // Bail out on errors to NEVER deploy broken code
  bail: true,
  target: 'node',
  entry: './server.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'server.js'
  },
  externals: nodeModules,
  module: {
    // build configuration
    loaders: [
      {
        test: /.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-1']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.ts', '.tsx', '.js'],
    modulesDirectories: ['node_modules']
  }
};
