'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('connect', function () {
  connect.server({
    root: './app',
    port: 8000,
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./app/*.html')
      .pipe(connect.reload());
});


gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html'])
      .watch(['./app/js/*.js'], ['js']);
});

gulp.task('default', ['connect', 'watch', 'html']);
