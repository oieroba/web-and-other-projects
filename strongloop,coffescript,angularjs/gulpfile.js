var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var express = require("express");
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var coffee = require('gulp-coffee');
var haml = require('gulp-haml');
var karma = require('karma').server;
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var wiredep = require('wiredep').stream;
var loopbackAngular = require('gulp-loopback-sdk-angular');
var app = express();

var paths = {
  sass: ['./build/scss/**/*.scss'],
  coffee: ['./build/coffee/**/*.coffee'],
  templates: ['./build/templates/**/*.haml'],
  tests: ['./build/tests/**/*.coffee']
};

gulp.task('default', ['watch', 'karma:watch', 'express'] );

gulp.task("express", function() {
  app.use(express.static('www'));
  app.listen(1337);
  return gutil.log("Listening on port: 1337");
});

gulp.task('sass', function(done) {
  gulp.src(paths.sass)
    .pipe(sass({ errLogToConsole: true}))
    .pipe(rename({ extname: '.css' }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./www/css'))
    .on('end', done);
});

gulp.task('coffee', function(done) {
  gulp.src(paths.coffee)
  .pipe(coffee({bare: true}).on('error', gutil.log))
  .pipe(concat('application.js'))
  .pipe(gulp.dest('./www/js'))
  .on('end', done);
})


gulp.task('tests', function(done) {
  gulp.src(paths.tests)
  .pipe(coffee({bare: true}).on('error', gutil.log))
  .pipe(concat('application.test.js'))
  .pipe(gulp.dest('./tests'))
  .on('end', done);
})

gulp.task('haml', function(done) {
  gulp.src(paths.templates)
  .pipe(haml())
  .pipe(gulp.dest('./www/templates'))
  .on('end', done);
})

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.tests, ['tests']);
  gulp.watch(paths.coffee, ['coffee'])
  gulp.watch(paths.templates, ['haml'])
});

gulp.task('karma', function(done) {
    karma.start({
        configFile: __dirname + '/tests/my.conf.js',
        singleRun: true
    }, function() {
        done();
    });
});

gulp.task('karma:watch', function(done) {
  karma.start({
    configFile: __dirname + '/tests/my.conf.js'
  }, done);
})


gulp.task('wire', function () {
  gulp.src('./www/index.html')
    .pipe(wiredep())
    .pipe(gulp.dest('./www'));
});

gulp.task('loopback', function () {
	return gulp.src('../radiant9-api/server/server.js')
    .pipe(loopbackAngular())
    .pipe(rename('loopback-services.js'))
    .pipe(gulp.dest('./www/js'));
});
