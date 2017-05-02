var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var nodemon = require('gulp-nodemon');

gulp.task('browser-sync', ['sass','nodemon'], function () {
	browserSync.init(null, {
		proxy: "http://localhost:3000",
		port:7000
	});
});

// Compile SASS檔案
gulp.task('sass', function() {
    return gulp.src("assets/scss/*.scss")
      .pipe(sass())
      .pipe(gulp.dest("assets/css"))
      .pipe(browserSync.stream());
});

//啟動server
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

//監看 檔案有改變時刷新或compile
gulp.task('watch', function () {
  gulp.watch("app/scss/*.scss", ['sass']);
	gulp.watch("assets/css/*.*").on('change', browserSync.reload);
	gulp.watch("assets/js/*.*").on('change', browserSync.reload);
	gulp.watch("views/*.*").on('change', browserSync.reload);
  gulp.watch("views/**/*.*").on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync', 'watch']);
