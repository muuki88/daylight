import {Config} from 'webpack-config';
import path from 'path';
import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default new Config().merge({
  entry: {
    bundle: ['babel-polyfill', './src/index.tsx']
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  module: {
    // build configuration
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react', 'stage-1']
        }
      },
      {test: /\.[s]?css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader?importLoaders=1', 'postcss-loader')},
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file?name=public/fonts/[name].[ext]'
      }
    ]
  },
  // Automatically transform files with these extensions
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.ts', '.tsx', '.js', '.jsx', '.css', '.scss'],
    modulesDirectories: ['node_modules']
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new HtmlWebpackPlugin({
      template: 'src/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    }),
  ]
});
