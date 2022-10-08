const dartSass = require('sass');
const gulpSass = require('gulp-sass');
const rename = require('gulp-rename');
const autoprefixer = require('autoprefixer');
const tilde = require('node-sass-tilde-importer');

const gulpPostcss = require('gulp-postcss');
const tailwind = require('tailwindcss');
const cssnano = require('cssnano');

const sass = gulpSass(dartSass);

const scss = () => {
  return gulpApp.gulp
    .src(gulpApp.path.src.scss, {sourcemaps: true})
    .pipe(
      sass
        .sync({
          importer: tilde,
          includePaths: ['./node_modules'],
          // outputStyle: 'expanded',
        })
        .on('error', sass.logError),
    )
    .pipe(
      gulpPostcss(
        [
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
    .pipe(
      rename({
        extname: '.min.css',
      }),
    )
    .pipe(gulpApp.gulp.dest(gulpApp.path.build.css))
    .pipe(gulpApp.plugins.browsersync.stream());
};

module.exports = scss;
