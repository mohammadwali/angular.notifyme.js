var del = require("del");
var gulp = require("gulp");
var uglify = require("gulp-uglifyjs");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');

gulp.task("build-js", function (done) {

    return gulp.src([
        "./bower_components/notify-me/notifyme.js",
        "./src/angular.notifyMe.js"
    ])
        .pipe(concat("angular.notifyMe.js"))
        .pipe(gulp.dest("dist"));
});


gulp.task("minfiy-js", function (done) {
    return gulp.src([
        "./dist/angular.notifyMe.js"
    ])
        .pipe(uglify({
            outSourceMap: true
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest("dist"));
});


gulp.task("build-css", function (done) {
    return gulp.src([
        "./bower_components/notify-me/notifyme.css"
    ])  .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));
        
});

gulp.task("clean", function (done) {
    del(['dist'], done);
});


gulp.task("default", ["clean", "build-js", "minfiy-js", "build-css"]);