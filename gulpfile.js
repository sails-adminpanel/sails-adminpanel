const gulp = require('gulp');
const { path } = require('./gulp/config/path.js');
const { plugins } = require('./gulp/config/plugins.js');

global.gulpApp = {
	path: path,
	gulp: gulp,
	plugins: plugins,
};
const copy_dep = require('./gulp/tasks/copy_dep.js');
const copy_fonts = require('./gulp/tasks/copy_fonts.js');
const reset = require('./gulp/tasks/reset.js');
const scss = require('./gulp/tasks/scss.js');
const scssProd = require('./gulp/tasks/scss_prod.js');
const js = require('./gulp/tasks/js.js');
const jsProd = require('./gulp/tasks/js_prod.js');
const img = require('./gulp/tasks/img.js');
const sync = require('./gulp/tasks/sync.js');
const { otfToTtf, ttfToWoff } = require('./gulp/tasks/fonts_create.js');
const fontsStyle = require('./gulp/tasks/fonts.js');
const svgSprite = require('./gulp/tasks/svgSprite.js');
const svgSpriteProd = require('./gulp/tasks/svgSprite_prod.js');

const views = () => {
	return gulp
		.src('./views/**/*.ejs')
		.pipe(gulpApp.plugins.browsersync.stream());
};

const assets = () => {
	return gulp.src('./seeds/assets/**').pipe(gulp.dest('./.tmp/public'));
};

function watcher() {
	gulp.watch(path.watch.ejs, views);
	gulp.watch(path.watch.scss, scss);
	gulp.watch(path.watch.js, js);
	gulp.watch(path.watch.img, img);
}

// gulp.watch('./assets/sprites/*.svg', svgSprite);

const fonts_create = gulp.series(otfToTtf, ttfToWoff);

const mainTasks = gulp.series(
	fontsStyle,
	svgSprite,
	gulp.parallel(scss, js, img)
);
const prodTasks = gulp.series(
	fontsStyle,
	gulp.parallel(scssProd, jsProd, img, svgSpriteProd)
);

const dev = gulp.series(
	assets,
	reset,
	copy_dep,
	copy_fonts,
	mainTasks,
	gulp.parallel(watcher, sync)
);
const prod = gulp.series(reset, copy_dep, copy_fonts, prodTasks);

gulp.task('dev', dev);
gulp.task('prod', prod);

gulp.task('svgSprite', svgSprite);
gulp.task('fonts_create', fonts_create);
