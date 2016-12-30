import webpack from 'webpack';
import Config from 'webpack-config';

export default new Config().extend('./webpack/webpack.config.base.js').merge({
  // Bail out on errors to NEVER deploy broken code
  bail: true,
  plugins: [
    // Export $NODE_ENV=production to the frontend application.  Switches a
    // number of libraries (notably Redux) into production mode
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    // Minify to reduce file size
    new webpack.optimize.UglifyJsPlugin(),
    // Assign the module and chunk ids by occurrence count, to make IDs
    // predictable and reduce file size
    new webpack.optimize.OccurenceOrderPlugin()
  ]
});
