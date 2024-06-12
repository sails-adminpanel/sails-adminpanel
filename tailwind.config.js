/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./views/**/*.ejs',
		'./assets/src/styles/style.scss',
		'./assets/src/catalog/*.vue',
	],
	theme: {
		container: {
			center: true,
		},
		screens: {
			xl: {max: '1200px'},
			lg: {max: '1024px'},
			md: {max: '768px'},
			sm: {max: '475px'},
			xs: {max: '375px'},
			xxs: {max: '320px'},
		},
		extend: {
			colors: {
				fa_fa: '#fafafa'
			},
		},
	},
	plugins: [],
	darkMode: 'class',

}
