const webpack = require('webpack-stream');

const js = () => {
  return gulpApp.gulp.src(gulpApp.path.src.js, { sourcemaps: true })
    .pipe(webpack({
      mode: 'development',
      output: {
        filename: 'script.min.js',
      },
      optimization: {
        minimize: false,
      },
    }))
    .pipe(gulpApp.gulp.dest(gulpApp.path.build.js))
    .pipe(gulpApp.plugins.browsersync.stream());
};

module.exports = js;
