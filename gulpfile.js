var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
    gulp.src('./src/themes/**/*.scss')
        .pipe(sass({errLogToConsole: true}))
        .pipe(gulp.dest('./dist/themes'));
});

gulp.task('watch', function () {
    gulp.watch('./src/themes/**/*.scss', function () {
        gulp.run('sass');
    });
});

gulp.task('default', function() {

    gulp.run('watch');

});