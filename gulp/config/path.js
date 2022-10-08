const nodePath = require('path');
const rootFolder = nodePath.basename(nodePath.resolve());

const buildFolder = `./assets/dist`;
const srcFolder = `./assets`;

module.exports.path = {
  build: {
    js: `${buildFolder}/js/`,
    dependencies: `${buildFolder}/dependencies/`,
    img: `${buildFolder}/images/`,
    css: `${buildFolder}/styles/`,
    fonts: `${buildFolder}/fonts/`,
  },
  src: {
    js: `${srcFolder}/js/script.js`,
    dependencies: `${srcFolder}/dependencies/*.js`,
    img: `${srcFolder}/images/**/*.{jpg,jpeg,png,gif,webp,svg}`,
    svgicons: `${srcFolder}/sprites/*.svg`,
    scss: `${srcFolder}/styles/style.scss`,
    fonts: `${srcFolder}/fonts/ready/*.{woff,woff2}`,
  },
  watch: {
    js: `${srcFolder}/js/**/*.js`,
    scss: [
      `${srcFolder}/styles/**/*.scss`,
      `./views/**/*.ejs`,
      `./tailwind.config.js`,
    ],
    ejs: [`${srcFolder}/views/**/*.ejs`, `./views/**/*.ejs`],
    img: `${srcFolder}/images/**/*.{jpg,jpeg,png,gif,webp}`,
  },
  clean: buildFolder,
  srcfolder: srcFolder,
  rootfolder: rootFolder,
};
