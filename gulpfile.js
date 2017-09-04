const path = require('path');
const gulp = require('gulp');
const jspm = require('jspm');

const DIR_ASSETS_OUTPUT = path.resolve(__dirname, 'public/javascripts');

gulp.task('default', ['bundle']);

gulp.task('bundle', () => {
    return jspm.bundle('javascripts/App', path.resolve(DIR_ASSETS_OUTPUT, 'bundle.js'), {inject: true});
});
