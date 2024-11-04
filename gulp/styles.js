const merge = require("merge-stream");
const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const tilde = require("node-sass-tilde-importer");
const gulpPostcss = require("gulp-postcss");
const tailwind = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const rename = require("gulp-rename");
const {path, buildFolder, srcFolder} = require('./path')
const dartSass = require('sass');
const gulpSass = require('gulp-sass');
const sass = gulpSass(dartSass);
const postcssImport = require('postcss-import');

const copy_styles_files = () => {
	return merge([
		gulp.src('./node_modules/jsoneditor/src/scss/img/**/*.*')
			.pipe(gulp.dest('./assets/build/style/img')),
		gulp.src('./node_modules/line-awesome/dist/line-awesome/fonts/**/*.*')
			.pipe(gulp.dest('./assets/build/fonts')),
		gulp.src('./node_modules/ace-builds/src-min-noconflict/**/*.*')
			.pipe(gulp.dest('./assets/build/js/ace')),
		gulp.src('./node_modules/jsoneditor/dist/jsoneditor.min.js')
			.pipe(gulp.dest('./assets/build/js/jsoneditor')),
		gulp.src('./node_modules/leaflet-draw/dist/images/**/*.*')
			.pipe(gulp.dest('./assets/build/style/images')),
		gulp.src('./assets/src/ckeditor/**/*.*')
			.pipe(gulp.dest('./assets/build/js/ckeditor'))
	]);
};

const scss = () => {
	return gulp.src(path.src.scss, {sourcemaps: true})
		.pipe(sourcemaps.init())
		.pipe(
			sass
				.sync({
					importer: tilde,
					includePaths: ['./node_modules'],
					outputStyle: 'expanded',
				})
				.on('error', sass.logError),
		)
		.pipe(
			gulpPostcss(
				[
					postcssImport,
					tailwind('./tailwind.config.js'),
					autoprefixer({
						// grid: true,
						overrideBrowserslist: ['Last 3 versions'],
						cascade: false,
					}),
					cssnano,
				],
				{},
			),
		)
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.build.css));
};

const scssProd = () => {
	return gulp.src(path.src.scss, {sourcemaps: true})
		.pipe(
			sass
				.sync({
					importer: tilde,
					includePaths: ['./node_modules'],
					outputStyle: 'expanded',
				})
				.on('error', sass.logError),
		)
		.pipe(
			gulpPostcss(
				[
					postcssImport,
					tailwind('./tailwind.config.js'),
					autoprefixer({
						// grid: true,
						overrideBrowserslist: ['Last 3 versions'],
						cascade: false,
					}),
					cssnano,
				],
				{},
			),
		)
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest(path.build.css));
};

module.exports = {
	copy_styles_files,
	scss,
	scssProd
}
