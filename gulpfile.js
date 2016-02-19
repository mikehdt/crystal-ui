var gulp       = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    plumber    = require('gulp-plumber'),

    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    nano         = require('gulp-cssnano');

// Watcher
gulp.task('watch', function () {
    gulp.watch('./grids/sass/**/*.scss', ['sass']);
});

// SASS
gulp.task('sass', function () {
    return gulp.src('./grids/sass/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 version']
    }))
    // .pipe(nano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./grids/css/'));
});

// Run the initial tasks, then set to watch status
gulp.task('default', ['sass', 'watch']);