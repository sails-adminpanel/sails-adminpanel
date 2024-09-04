const gulp = require("gulp");
const webpackStream = require("webpack-stream");
const js = () => {
	return gulp.src(path.src.js, {sourcemaps: true})
		.pipe(webpackStream({
			mode: 'development',
			output: {
				filename: 'script.min.js'
			},
			optimization: {
				minimize: false
			},
		}))
		.pipe(gulp.dest(path.build.js));
};
const {path, buildFolder, srcFolder} = require('./path')

const jsProd = () => {
	return gulp.src(path.src.js, {sourcemaps: true})
		.pipe(webpackStream({
			mode: 'production',
			output: {
				filename: 'script.min.js'
			},
			optimization: {
				minimize: true
			},
		}))
		.pipe(gulp.dest(path.build.js));
};

module.exports = {
	js,
	jsProd
}
