'use strict';

// What files to monitor - when to rebuild and reload emulator?
var watchedFiles = [
	'app/src/*.{js,xml,css}',
	'app/src/**/*.{js,xml,css}'
];

// Where are your ES6 files which are going to be translated?
var babelSrc = [
    'app/src/**/*.js'
];

// Where are your resource files which are just being
// moved without any translation.
var resources = [
    'app/src/*.{xml,css}',
    'app/src/**/*.{xml,css}'
];

// These folders are cleaned every time a build is done.
// This pattern should be all the folders you have in /app/src/ 
var generatedSources = [
    './app/{shared,test,views}'
];

// Which emulator to run?
// Valid emulators are 
//    iPhone-4s, iPhone-5, iPhone-5s, iPhone-6-Plus, iPhone-6, 
//    iPad-2, iPad-Retina, iPad-Air, Resizable-iPhone, Resizable-iPa
var emulator = 'iPhone-5'; 



var gulp = require('gulp');
var chalk = require('chalk');
var spawn = require('child_process').spawn;
var babel = require('gulp-babel');
var mocha = require('gulp-mocha');
var mergeStream = require('merge-stream');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('_emulate', function(cb) {
    var child = spawn('tns', ['emulate', 'ios', '--device', emulator], {cwd: process.cwd()});
    var stdout = '';
    var stderr = '';

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function (data) {
        stdout += data;
        console.log(data);
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function (data) {
        stderr += data;
        console.log(chalk.red(data));
    });

    child.on('close', function(code) {
        console.log('Done with exit code', code);
    });

    cb();

});


gulp.task('_clean', function(cb) {
    del(generatedSources, cb);
});

gulp.task('_compile', function() {
    var js = gulp.src(babelSrc)
        .pipe(babel({
            stage: 1
         }))
        .pipe(gulp.dest('app'));

    var res = gulp.src(resources)
        .pipe(gulp.dest('app'));

    return mergeStream(js, res);
});


gulp.task('_test', function() {
    return gulp.src(['app/test/*.js'], { read: false })
        .pipe(mocha({
            reporter: 'spec'
        }));
});


gulp.task('test', function(callback) {
    runSequence(
        '_clean',
        '_compile',
        '_test',
        callback);
});



gulp.task('watch', function(callback) {
    console.log();
    console.log(chalk.blue('Watcher started, will restart emulator ') + chalk.yellow(emulator) + chalk.blue(' when files change'));
    console.log('Tip: Run "gulp help" to show help');
    console.log();
    gulp.watch(watchedFiles, function () {
            runSequence(
                '_clean',
                '_compile',
                '_emulate',
                callback);
        }
    );
});


gulp.task('default', function() {
    console.log();
	console.log(chalk.magenta('  Main tasks'));
    console.log();
    console.log('    ' + chalk.blue('gulp watch') + '               - Start watching files, recompile Javascript and restart');
    console.log('                               emulator (set to: ' + emulator + ') when files change.');
	console.log('    ' + chalk.blue('gulp test ') + '               - Clean, compile and run tests in /app/tests');
    console.log();
	console.log(chalk.magenta('  Sub-tasks') + ' (primarily run by main tasks)');
    console.log();
	console.log('    ' + chalk.blue('gulp _clean') + '             - Clean target folders (' + generatedSources.join(', ') + ')');
	console.log();
	console.log('    ' + chalk.blue('gulp _compile') + '           - Compile Javascript');
	console.log();
	console.log('    ' + chalk.blue('gulp _test') + '              - Run emulator (set to: ' + emulator + ')');
    console.log();
});
