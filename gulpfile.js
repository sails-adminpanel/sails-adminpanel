const gulp = require('gulp');
const del = require('del');  // del@6.1.1 
const dartSass = require('sass');
const gulpSass = require('gulp-sass');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const tilde = require('node-sass-tilde-importer');
const { src } = require('gulp');

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
    js: `${srcFolder}/main_script.js`,
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

// const views = () => {
// 	return gulp
// 		.src('./views/**/*.ejs')
// 		.pipe(gulpApp.plugins.browsersync.stream());
// };

// const assets = () => {
// 	return gulp.src('./seeds/assets/**').pipe(gulp.dest('./.tmp/public'));
// };

// function watcher() {
// 	gulp.watch(path.watch.ejs, views);
// 	gulp.watch(path.watch.scss, scss);
// 	gulp.watch(path.watch.js, js);
// 	gulp.watch(path.watch.img, img);
// }

// // gulp.watch('./assets/sprites/*.svg', svgSprite);

// const fonts_create = gulp.series(otfToTtf, ttfToWoff);

// const mainTasks = gulp.series(
// 	fontsStyle,
// 	svgSprite,
// 	gulp.parallel(scss, js, img)
// );
// const prodTasks = gulp.series(
// 	fontsStyle,
// 	gulp.parallel(scssProd, jsProd, img, svgSpriteProd)
// );

// const dev = gulp.series(
// 	assets,
// 	reset,
// 	copy_dep,
// 	copy_fonts,
// 	mainTasks,
// 	gulp.parallel(watcher, sync)
// );
// const prod = gulp.series(reset, copy_dep, copy_fonts, prodTasks);
const build = gulp.series(reset, copy_styles_files, scss);

gulp.task('default', build);