const gulp = require('gulp');
const del = require('del');  // del@6.1.1 
const dartSass = require('sass');
const gulpSass = require('gulp-sass');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const tilde = require('node-sass-tilde-importer');
const webpack = require("webpack-stream");

const sass = gulpSass(dartSass)

const buildFolder = `./assets/build`;
const srcFolder = `./assets/src`;

const path = {
  build: {
    js: `${buildFolder}/js/`,
    css: `${buildFolder}/style/`,
    fonts: `${buildFolder}/fonts/`,
  },
  src: {
    js: `${srcFolder}/scripts/main_script.js`,
    scss: `${srcFolder}/styles/style.scss`,
    fonts: `${srcFolder}/fonts/ready/*.{woff,woff2}`,
  },
  clean: buildFolder,
  srcfolder: srcFolder,
};

const reset = () => {
	return del(path.clean)
}

const copy_styles_files = () => {
	return gulp.src('../../node_modules/jsoneditor/src/scss/img/**/*.*')
		.pipe(gulp.dest('./assets/build/style/img'))
		.pipe(gulp.src('../../node_modules/line-awesome/dist/line-awesome/fonts/**/*.*'))
		.pipe(gulp.dest('./assets/build/fonts'))
}

const scss = () => {
	return gulp.src(path.src.scss, { sourcemaps: true })
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
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.build.css))
}

const js = () => {
	return gulp.src(path.src.js, { sourcemaps: true })
		.pipe(webpack({
			mode: 'development',
			output: {
				filename: 'script.min.js'
			},
			optimization: {
				minimize: false
			},
		}))
		.pipe(gulp.dest(path.build.js))
}


const build = gulp.series(reset, copy_styles_files, scss, js);

gulp.task('default', build);