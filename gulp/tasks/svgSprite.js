const Sprite = require('gulp-svg-sprite');

const svgSprite = () => {
  return gulpApp.gulp.src(gulpApp.path.src.svgicons)
    .pipe(Sprite({
      mode: {
        stack: {
          sprite: '../icons/icons.svg',
          example: true,
        },
      },
    }))
    .pipe(gulpApp.gulp.dest(gulpApp.path.build.img));
};

module.exports = svgSprite;
