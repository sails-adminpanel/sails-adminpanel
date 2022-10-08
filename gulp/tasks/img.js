//import webp from 'gulp-webp'
//import imagemin from 'gulp-imagemin'

const img = () => {
	return gulpApp.gulp.src(gulpApp.path.src.img)
		.pipe(gulpApp.plugins.newer(gulpApp.path.build.img))
		//.pipe(webp())
		.pipe(gulpApp.gulp.dest(gulpApp.path.build.img))
		//.pipe(gulpApp.gulp.src(gulpApp.path.src.img))
		//.pipe(gulpApp.gulp.dest(gulpApp.path.build.img))
		.pipe(gulpApp.plugins.browsersync.stream())
}

module.exports = img