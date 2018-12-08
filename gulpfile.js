// AH - Basic gulpfile used to build & serve assets for local development
// TODO: Probably circle-back and replace this with Webpack or something coz Gulp ain't hip no more :P
var gulp = require('gulp');
var shell = require('gulp-shell');
var browserSync = require('browser-sync').create();
var siteRoot = '_site';

gulp.task('build', shell.task(['jekyll serve']));

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: '_site/'
    },
    port: 4000
  });
  gulp.watch('_site/**/*.*').on('change', browserSync.reload);
});

gulp.task('default', ['build', 'serve']);
