const buildFolder = `./assets/build`;
const srcFolder = `./assets/src`;

const path = {
	build: {
		js: `${buildFolder}/js/`,
		css: `${buildFolder}/style/`,
		fonts: `${buildFolder}/fonts/`,
	},
	src: {
		js: `${srcFolder}/scripts/main_script.js`,
		scss: `${srcFolder}/styles/style.scss`,
		fonts: `${srcFolder}/fonts/ready/*.{woff,woff2}`,
		ejs: './views/**/*.*'
	},
	watch:{
		scss: `${srcFolder}/styles/**/*.scss`,
		catalogVue: `${srcFolder}/catalog/**/*.{vue,css}`
	},
	clean: buildFolder,
	srcfolder: srcFolder,
};

module.exports = {
	path,
	buildFolder,
	srcFolder
}
