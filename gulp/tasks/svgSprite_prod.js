const Sprite = require('gulp-svg-sprite')

const svgSpriteProd = () => {
	return gulpApp.gulp.src(gulpApp.path.src.svgicons)
		.pipe(Sprite({
			mode: {
				stack: {
					sprite: '../icons/icons.svg',
					example: false
				}
			}
		}))		
		.pipe(gulpApp.gulp.dest(gulpApp.path.build.img))		
}

module.exports = svgSpriteProd