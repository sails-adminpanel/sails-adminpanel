const ejsView = () => {
  return gulpApp(gulpApp.plugins.browsersync.stream());
};

module.exports = ejsView;
