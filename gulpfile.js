var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var gulpSass = require('gulp-sass');
var browserSync = require('browser-sync');

gulp.task('default', ['browser-sync'], function () {
});

gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:3000",
      files: ["views/*.*","views/**/*.*","assets/css/*.*","assets/js/*.*"],
      browser: "google chrome",
      port:7000,
	});
});

gulp.task('styles', function () {
    gulp.src('scss/**/*.scss')
        .pipe(gulpSass())
        .pipe(gulp.dest('css'));  
});

gulp.task('nodemon', function (cb) {
	var started = false;
	return nodemon({
		script: 'app.js'
	}).on('start', function () {
		if (!started) {
			cb();
			started = true;
		}
	});
});
