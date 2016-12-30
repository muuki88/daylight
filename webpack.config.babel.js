// The filename .babel.js triggers evaluation of this file through Babel, at the language levels defined in .babelrc
//
// This lets us write all of our webpack configuration in ES6.

import {Config, environment} from 'webpack-config';

environment.setAll({
  env: () => process.env.WEBPACK_ENV || process.env.NODE_ENV || 'dev'
});

export default new Config().extend('./webpack/webpack.config.[env].js');
