const sync = () => {
  gulpApp.plugins.browsersync.init({
    proxy: {
      target: 'localhost:1337',
      ws: true,
    },
    open: false,
    files: ['.tmp/public/**/*.*', 'views/**/*.ejs'],
    port: 7000,
    notify: false,
  })
}

module.exports = sync
