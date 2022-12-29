const gulp = require('gulp');
const del = require('del');  // del@6.1.1
const dartSass = require('sass');
const gulpSass = require('gulp-sass');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const tilde = require('node-sass-tilde-importer');
const sass = gulpSass(dartSass);
const webpackStream = require('webpack-stream');
const merge = require('merge-stream');
//const { VueLoaderPlugin  } = require('vue-loader')
const Fpath = require('path');
const webpack = require('webpack');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');



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
  },
  clean: buildFolder,
  srcfolder: srcFolder,
};

const reset = () => {
  return del(path.clean);
};

const copy_styles_files = () => {
  return merge([
    gulp.src('./node_modules/jsoneditor/src/scss/img/**/*.*')
			.pipe(gulp.dest('./assets/build/style/img')),
    gulp.src('./node_modules/line-awesome/dist/line-awesome/fonts/**/*.*')
			.pipe(gulp.dest('./assets/build/fonts')),
    gulp.src('./node_modules/ace-builds/src-min-noconflict/**/*.*')
			.pipe(gulp.dest('./assets/build/js/ace')),
    gulp.src('./node_modules/jsoneditor/dist/jsoneditor.min.js')
			.pipe(gulp.dest('./assets/build/js/jsoneditor')),
    gulp.src('./node_modules/leaflet-draw/dist/images/**/*.*')
			.pipe(gulp.dest('./assets/build/style/images')),
    gulp.src('./assets/src/ckeditor/**/*.*')
			.pipe(gulp.dest('./assets/build/js/ckeditor'))
  ]);
};

const scss = () => {
  return gulp.src(path.src.scss, { sourcemaps: true })
		.pipe(sourcemaps.init())
		.pipe(
			sass
				.sync({
				  importer: tilde,
				  includePaths: ['./node_modules'],
				  outputStyle: 'expanded',
				})
				.on('error', sass.logError),
		)
		.pipe(rename({
		  extname: '.min.css'
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.build.css));
};

const scssProd = () => {
  return gulp.src(path.src.scss, { sourcemaps: true })
		.pipe(
			sass
				.sync({
				  importer: tilde,
				  includePaths: ['./node_modules'],
				  outputStyle: 'compressed',
				})
				.on('error', sass.logError),
		)
		.pipe(rename({
		  extname: '.min.css'
		}))
		.pipe(gulp.dest(path.build.css));
};

const js = () => {
  return gulp.src(path.src.js, { sourcemaps: true })
		.pipe(webpackStream({
		  mode: 'development',
		  output: {
		    filename: 'script.min.js'
		  },
		  optimization: {
		    minimize: false
		  },
		}))
		.pipe(gulp.dest(path.build.js));
};

const jsProd = () => {
  return gulp.src(path.src.js, { sourcemaps: true })
		.pipe(webpackStream({
		  mode: 'production',
		  output: {
		    filename: 'script.min.js'
		  },
		  optimization: {
		    minimize: true
		  },
		}))
		.pipe(gulp.dest(path.build.js));
};

// const vue = () => {
// 	return gulp.src(`${srcFolder}/scripts/vue/app.js`, { sourcemaps: true })
// 		.pipe(webpackStream({
// 			mode: 'development',
// 			entry: `${srcFolder}/scripts/vue/app.js`,
// 			output: {
// 				path: Fpath.resolve('./assets/build/js/'),
// 				filename: 'vue-app.js'
// 			},
// 			module: {
// 				rules: [
// 					{
// 						test: /\.vue$/,
// 						loader: 'vue-loader'
// 					},
// 					{
// 						test: /\.css$/,
// 						use: [
// 						  'vue-style-loader',
// 						  'css-loader',
// 						]
// 					  }
// 				]
// 			},
// 			plugins: [
// 				new VueLoaderPlugin(),
// 				new webpack.DefinePlugin({
// 					__VUE_PROD_DEVTOOLS__: true,
// 					__VUE_OPTIONS_API__: true
// 				  })
// 			]
// 		}))
// 		.pipe(gulp.dest(`${path.build.js}/vue/`))
// }

const ckeditorBuild = () => {
  return gulp.src(`${srcFolder}/scripts/ckeditor5/app.js`, { sourcemaps: true })
		.pipe(webpackStream({
		  mode: 'production',
		  devtool: 'source-map',
		  performance: { hints: false },
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

		  // By default webpack logs warnings if the bundle is bigger than 200kb.
		  performance: { hints: false }
		}))
		.pipe(gulp.dest(`${path.build.js}/ckeditor5/`));
};

const build = gulp.series(reset, copy_styles_files, scss, js, ckeditorBuild);

const prod = gulp.series(reset, copy_styles_files, scssProd, jsProd, ckeditorBuild);

gulp.task('default', build);
gulp.task('prod', prod);
//gulp.task('vue', vue)
gulp.task('ckeditorBuild', ckeditorBuild);
