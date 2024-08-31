const gulp = require("gulp");
const webpackStream = require("webpack-stream");
const Fpath = require("path");
const {VueLoaderPlugin} = require("vue-loader");
const {path, buildFolder, srcFolder} = require('../path')
const webpack = require('webpack');

const vueWidgets = () => {
	return gulp.src(`${srcFolder}/widgets/app.js`, { sourcemaps: true })
		.pipe(webpackStream({
			mode: 'development',
			entry: `${srcFolder}/widgets/app.js`,
			output: {
				path: Fpath.resolve('./assets/build/js/'),
				filename: 'vue-widgets.js'
			},
			module: {
				rules: [
					{
						test: /\.vue$/,
						loader: 'vue-loader'
					},
					{
						test: /\.css$/,
						use: [
							'vue-style-loader',
							'css-loader',
						]
					}
				],
			},
			experiments: {
				topLevelAwait: true
			},
			plugins: [
				new VueLoaderPlugin(),
				new webpack.DefinePlugin({
					__VUE_PROD_DEVTOOLS__: true,
					__VUE_OPTIONS_API__: true
				})
			]
		}))
		.pipe(gulp.dest(`${path.build.js}/`))
}

const vueWidgetsProd = () => {
	return gulp.src(`${srcFolder}/widgets/app.js`, { sourcemaps: true })
		.pipe(webpackStream({
			mode: 'production',
			entry: `${srcFolder}/widgets/app.js`,
			output: {
				path: Fpath.resolve('./assets/build/js/'),
				filename: 'vue-widgets.js'
			},
			module: {
				rules: [
					{
						test: /\.vue$/,
						loader: 'vue-loader'
					},
					{
						test: /\.css$/,
						use: [
							'vue-style-loader',
							'css-loader',
						]
					}
				],
			},
			experiments: {
				topLevelAwait: true
			},
			plugins: [
				new VueLoaderPlugin(),
				new webpack.DefinePlugin({
					__VUE_PROD_DEVTOOLS__: false,
					__VUE_OPTIONS_API__: true
				})
			]
		}))
		.pipe(gulp.dest(`${path.build.js}/`))
}

module.exports = {
	vueWidgets,
	vueWidgetsProd
}
