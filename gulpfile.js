const { src, dest } = require('gulp');

exports.default = function() {
  return src(['src/**/*.js','src/**/*.css','src/**/*.html'])
    .pipe(dest('dist/'));
}