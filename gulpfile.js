const autoprefixer = require('autoprefixer');
const bs = require('browser-sync').create();
const cssnano = require('cssnano');
const { dest, series, src, watch } = require('gulp');
const postcss = require('gulp-postcss');
const webpack = require('webpack-stream');

const webpackConfig = require('./webpack.config');

const postcssPlugins = [
  autoprefixer(),
  cssnano(),
];

const bundleJS = () => {
  return src('./src/js/script.js')
    .pipe(webpack(webpackConfig))
    .pipe(dest('dist/js'));
}

const injectCSS = () => {
  return src('**/*.css')
    .pipe(bs.stream());
}

const reload = (cb) => {
  bs.reload();
  cb();
}

const processCSS = () => {
  return src('./src/css/**/*.css')
    .pipe(postcss(postcssPlugins))
    .pipe(dest('./dist/css'));
}

const processHTML = () => {
  return src('./src/html/**/*.html')
    .pipe(dest('./dist'));
}

const start = (cb) => {
  bundleJS();
  processCSS();
  processHTML();

  bs.init({
    browser: 'firefox',
    server: './dist',
  });

  cb();
}

watch(['**/*.html'], series(
  processHTML,
  reload
));

watch(['**/*.css'], series(
  processCSS,
  injectCSS
));

watch(['src/js/**/*.js'], series(
  bundleJS,
  reload
));

exports.buildProd = series(bundleJS, processCSS, processHTML);

exports.default = start;
