module.exports = {
  plugins: [
    require('precss')({ /* ...options */ }),
    require('postcss-mixins'),
    require('postcss-nested')({ /* ...options */ }),
    require('autoprefixer')({ /* ...options */ })
  ]
};
