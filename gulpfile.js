'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');
var plumber = require('gulp-plumber');
var lint = require('gulp-eslint');
var mocha = require('gulp-mocha');

var paths = {
  html: './app/*.html',
  js: './app/js/*.js',
  tests: './test/*Spec.js'
};

gulp.task('connect', function () {
  connect.server({
    root: './app',
    port: 8000,
    livereload: true
  });
});

gulp.task('test', function () {
  return gulp.src(paths.tests)
             .pipe(mocha());
});

gulp.task('html', function () {
  gulp.src(paths.html)
      .pipe(plumber())
      .pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src(paths.js)
      .pipe(plumber())
      .pipe(lint())
      .pipe(lint.formatEach())
      .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch([paths.html], ['html']);
  gulp.watch([paths.js], ['test', 'js']);
  gulp.watch([paths.tests], ['test']);
});

gulp.task('default', gulp.series(['connect', 'html', 'js', 'test', 'watch']));
