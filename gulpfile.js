var gulp = require('gulp');
var Server = require('karma').Server;
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');


function handleError(err) {
  console.log(err.toString());
  this.emit('end');
};
/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

/**
 * Compile js into one file
 */
gulp.task("js", function () {
  return gulp.src(['./src/**/**/main.js', './src/**/**/*.module.js', './src/**/**/*.js'])
    .on('error', handleError)
    .pipe(sourcemaps.init())
    .pipe(concat('angular-http-cancellable.js'))
    .on('error', handleError)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'));
});

//Minify
gulp.task("js-min", function () {
  return gulp.src(['./src/**/**/main.js', './src/**/**/*.module.js', './src/**/**/*.js'])
    .on('error', handleError)
    .pipe(sourcemaps.init())
    .pipe(concat('angular-http-cancellable.min.js'))
    .on('error', handleError)
    .pipe(uglify({
        mangle: false
      })
    .on('error', handleError))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
  gulp.watch(["./src/**/*.js"], ['js']);
  gulp.watch(["./test/**/*.js"], ['test']);
});

gulp.task('build', ['js', 'js-min']);

gulp.task('default', ['js', 'test', 'watch']);