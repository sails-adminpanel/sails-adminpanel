const copy_fonts = () => {
	return gulpApp.gulp.src(gulpApp.path.src.fonts)
		.pipe(gulpApp.gulp.dest(gulpApp.path.build.fonts))
}

module.exports = copy_fonts