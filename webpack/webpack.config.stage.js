import webpack from 'webpack';
import Config from 'webpack-config';

export default new Config().extend('./webpack/webpack.config.base.js').merge({
  // Switch all loaders to debugging mode
  debug: true,
  // Debugging support in browser: Eval included modules with a source
  // reference.  Not suitable for production, but builds blazingly fast on dev
  devtool: 'eval',
  output: {
    // Include comments with information about the source path of modules
    pathinfo: true
  },
  // Live-reloading Webpack development server
  devServer: {
    port: 8000,
    // Enable hot-reloading in inline mode.  Use inline mode because it's nicer
    // than the iframe mode
    hot: true,
    inline: true,
    // Fancy progress bar and colours while building
    progress: true,
    colors: true,
    // Serve our single page application instead of all 404 errors
    historyApiFallback: true,
    // Serve files from the backend resource directory and not from the current
    // directory, because that's where our stuff actually resides
    contentBase: 'src/main/public',
    proxy: {
      // Forward API requests to the backend
      '/api': {
        target: 'http://localhost:3050',
        secure: false
      }
    }
  },
  plugins: [
    // Plugin required for hot-reloading
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
});
