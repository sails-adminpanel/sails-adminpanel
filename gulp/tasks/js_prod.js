const webpack = require('webpack-stream');

const jsProd = () => {
  return gulpApp.gulp.src(gulpApp.path.src.js, { sourcemaps: true })
		.pipe(webpack({
		  mode: 'production',
		  output: {
		    filename: 'script.min.js'
		  },
		  optimization: {
		    minimize: true
		  },
		}))
		.pipe(gulpApp.gulp.dest(gulpApp.path.build.js));
};

module.exports = jsProd;
