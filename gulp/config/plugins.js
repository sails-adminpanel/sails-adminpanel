const browserSync = require("browser-sync")
const newer = require("gulp-newer")

module.exports.plugins = {
	browsersync: browserSync,
	newer: newer
}