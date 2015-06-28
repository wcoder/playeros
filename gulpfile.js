var gulp = require('gulp');
var sass = require('gulp-sass');
var react = require('gulp-react');
var concat = require('gulp-concat');

gulp.task('sass', function () {
	gulp.src('./src/themes/**/*.scss')
		.pipe(sass({errLogToConsole: true}))
		.pipe(gulp.dest('./dist/themes'));
});

gulp.task('jsx', function () {
	gulp.src('./src/**/*.jsx')
		.pipe(react())
		.pipe(gulp.dest('./dist'));
});

//gulp.task('concat', function () {
//
//	gulp.src('./dist/components/*.js')
//		.pipe(concat('playeros.js'))
//		.pipe(gulp.dest('./dist/'));
//
//});

gulp.task('watch', function () {
	gulp.watch('./src/themes/**/*.scss', function () {
		gulp.run('sass');
	});
	gulp.watch('./src/**/*.jsx', function () {
		gulp.run('jsx');
	});
});

gulp.task('build', function () {

	gulp.run('sass');
	gulp.run('jsx');
	//gulp.run('concat');

});

gulp.task('default', function() {

	gulp.run('watch');

});