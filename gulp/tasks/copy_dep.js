const copy_dep = () => {
  return gulpApp.gulp.src(gulpApp.path.src.dependencies)
    .pipe(gulpApp.gulp.dest(gulpApp.path.build.dependencies));
};

module.exports = copy_dep;
