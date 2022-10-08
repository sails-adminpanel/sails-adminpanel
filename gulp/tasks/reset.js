const del = require('del')

const reset = () => {
	return del(gulpApp.path.clean)
}

module.exports = reset