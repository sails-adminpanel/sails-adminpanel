/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./views/**/*.ejs',
		'./assets/src/styles/style.scss'
	],
	theme: {
		container: {
			center: true,
		},
		screens: {
			xxs: {max: '320px'},
			xs: {max: '375px'},
			sm: {max: '475px'},
			md: {max: '768px'},
			lg: {max: '1024px'},
			xl: {max: '1200px'},
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
