const gulp = require('gulp');
const del = require('del');  // del@6.1.1
const webpackStream = require('webpack-stream');
const Fpath = require('path');
const {styles} = require('@ckeditor/ckeditor5-dev-utils');
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');

const {copy_styles_files, scss, scssProd} = require('./gulp/styles')
const {js, jsProd} = require('./gulp/js')
const {vueWidgets, vueWidgetsProd} = require('./gulp/vue/widgets')
const {vueCatalog, vueCatalogProd} = require('./gulp/vue/catalog')
const {vueInstallStepper, vueInstallStepperProd} = require('./gulp/vue/install-stepper')
const {vueMediamanagerProd, vueMediamanager} = require('./gulp/vue/mediamanager')

const {path, buildFolder, srcFolder} = require('./gulp/path')

const browserSync = require("browser-sync").create()

const reset = () => {
	return del(path.clean);
};

const serve = (done) => {
	browserSync.init({
		proxy: {
			target: "localhost:1337",
			ws: true
		},
		open: false,
		port: 7000,
		notify: false
	})
	done()
}

const reload = (done) => {
	browserSync.reload();
	done();
}

const ckeditorBuild = () => {
	return gulp.src(`${srcFolder}/scripts/ckeditor5/app.js`, {sourcemaps: true})
		.pipe(webpackStream({
			mode: 'production',
			devtool: 'source-map',
			performance: {hints: false},
			entry: `${srcFolder}/scripts/ckeditor5/app.js`,

			// https://webpack.js.org/configuration/output/
			output: {
				path: Fpath.resolve('./assets/build/js/ckeditor5'),
				filename: 'ck5.js',
				library: 'ClassicEditor',
				libraryTarget: 'umd',
				libraryExport: 'default'
			},
			plugins: [
				new CKEditorWebpackPlugin({
					// UI language. Language codes follow the https://en.wikipedia.org/wiki/ISO_639-1 format.
					// When changing the built-in language, remember to also change it in the editor's configuration (src/ckeditor.js).
					language: 'en',
					additionalLanguages: 'all'
				}),
			],
			module: {
				rules: [
					{
						test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,

						use: ['raw-loader']
					},
					{
						test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,

						use: [
							{
								loader: 'style-loader',
								options: {
									injectType: 'singletonStyleTag',
									attributes: {
										'data-cke': true
									}
								}
							},
							'css-loader',
							{
								loader: 'postcss-loader',
								options: {
									postcssOptions: styles.getPostCssConfig({
										themeImporter: {
											themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
										},
										minify: true
									})
								}
							}
						]
					}
				]
			},

			// Useful for debugging.
			devtool: 'source-map',

			// By default, webpack logs warnings if the bundle is bigger than 200kb.
			performance: {hints: false}
		}))
		.pipe(gulp.dest(`${path.build.js}/ckeditor5/`));
};

function watcher() {
	gulp.watch(path.src.ejs, gulp.series(scss, reload))
	gulp.watch(path.src.scss, gulp.series(scss, reload))
}

function vueWidgetsWatcher(){
	gulp.watch(`${srcFolder}/widgets/**/*.*`, gulp.series(vueWidgets, reload))
	gulp.watch(path.watch.scss, gulp.series(scss, reload))
}
function vueCaalogWatcher(){
	gulp.watch(`${srcFolder}/catalog/**/*.*`, gulp.series(vueCatalog, reload))
	gulp.watch(path.watch.scss, gulp.series(scss, reload))
	gulp.watch(path.watch.catalogVue, gulp.series(scss, reload))
}
function vueMMWatcher(){
	gulp.watch(`${srcFolder}/mediamanager/**/*.*`, gulp.series(vueMediamanager, reload))
	gulp.watch(path.watch.scss, gulp.series(scss, reload))
	gulp.watch(path.watch.MMVue, gulp.series(scss, reload))
}

function vueInstallStepperWatcher(){
	gulp.watch(`${srcFolder}/installStepper/**/*.*`, gulp.series(vueInstallStepper, reload))
	gulp.watch(path.watch.scss, gulp.series(scss, reload))
}

const build = gulp.series(reset, copy_styles_files, scss, js, ckeditorBuild);
//const build = gulp.series(reset, copy_styles_files, scss, js);

const prod = gulp.series(reset, copy_styles_files, scssProd, ckeditorBuild, vueWidgetsProd, vueInstallStepperProd, vueCatalogProd, jsProd);
// const prodInstallStepper = gulp.series(reset, copy_styles_files, scssProd, jsProd, ckeditorBuild, vueInstallStepperProd);

gulp.task('default', build);
gulp.task('prod', prod);
// gulp.task('prodInstallStepper', prodInstallStepper);
gulp.task('ckeditorBuild', ckeditorBuild);

gulp.task('js', js);
gulp.task('jsProd', jsProd);
gulp.task('styles-prod', scssProd);
gulp.task('styles', gulp.series(scss, gulp.parallel(serve, watcher)))

gulp.task('vue', gulp.series(vueWidgets, gulp.parallel(serve, vueWidgetsWatcher) ,gulp.parallel(serve, vueInstallStepperWatcher)))

gulp.task('catalog', gulp.series(vueCatalog, gulp.parallel(serve, vueCaalogWatcher)))
gulp.task('prodCat', vueCatalogProd)

gulp.task('mm', gulp.series(vueMediamanager, gulp.parallel(serve,vueMMWatcher)))
gulp.task('prodMediamanager', vueMediamanagerProd)
