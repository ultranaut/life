'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');
var plumber = require('gulp-plumber');
var lint = require('gulp-eslint');

var paths = {
  html: './app/*.html',
  js: './app/js/*.js'
};

gulp.task('connect', function () {
  connect.server({
    root: './app',
    port: 8000,
    livereload: true
  });
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
  gulp.watch([paths.js], ['js']);
});

gulp.task('default', ['connect', 'html', 'js', 'watch']);
