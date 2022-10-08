const fs = require('fs')
const fonter = require('gulp-fonter')
const ttf2woff2 = require('gulp-ttf2woff2')

const otfToTtf = () => {
	return gulpApp.gulp.src(`${gulpApp.path.srcfolder}/fonts/source/*.otf`)
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(gulpApp.gulp.dest(`${gulpApp.path.srcfolder}/fonts/ready/`))
}

const ttfToWoff = () => {
	return gulpApp.gulp.src(`${gulpApp.path.srcfolder}/fonts/source/*.ttf`)
		.pipe(fonter({
			formats: ['woff']
		}))
		.pipe(gulpApp.gulp.dest(`${gulpApp.path.srcfolder}/fonts/ready`))
		.pipe(gulpApp.gulp.src(`${gulpApp.path.srcfolder}/fonts/source/*.ttf`))
		.pipe(ttf2woff2())
		.pipe(gulpApp.gulp.dest(`${gulpApp.path.srcfolder}/fonts/ready`))
}


module.exports = { otfToTtf, ttfToWoff }