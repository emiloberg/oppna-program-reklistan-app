'use strict';

var watchedFiles = [
	'app/src/**/*.{js,xml,css}'
];

var babelSrc = [
    'app/src/**/*.js'
];
var resources = [
    'app/src/**/*.{xml,css}'
];

var emulator = 'iPhone-5'; // Default emulator

var validEmulators = [
    'iPhone-4s',
    'iPhone-5',
    'iPhone-5s',
    'iPhone-6-Plus',
    'iPhone-6',
    'iPad-2',
    'iPad-Retina',
    'iPad-Air',
    'Resizable-iPhone',
    'Resizable-iPad'
];

var gulp = require('gulp-param')(require('gulp'), process.argv);
var spawn = require('child_process').spawn;
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var mocha = require('gulp-mocha');
var mergeStream = require('merge-stream');

gulp.task('emulate', function(device) {
    if (device !== null) {
        if (validEmulators.indexOf(device) === -1) {
            console.log();
            console.log(gutil.colors.red('Error!'));
            console.log(gutil.colors.red('"' + device + '" did not match a valid device'));
            console.log('Valid devices are: ' + validEmulators.join(', '));
            console.log();
            return true;
        } else {
            emulator = device;
        }
    }

//    console.log();
//    console.log(gutil.colors.blue('Watcher started, will restart emulator "' + emulator + '" when files change'));
//    console.log('Tip: Run "gulp help" to show help');
//    console.log();

//    gulp.watch(watchedFiles, function() {
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
        gutil.log(gutil.colors.red(data));
        gutil.beep();
    });

    child.on('close', function(code) {
        console.log('Done with exit code', code);
    });

//    });
});

gulp.task('clean', function() {/* TODO */});

gulp.task('compile', ['clean'], function() {
    var js = gulp.src(babelSrc)
        .pipe(babel({
            optional: ["es7.decorators"]
        }))
        .pipe(gulp.dest('app'));

    var res = gulp.src(resources)
        .pipe(gulp.dest('app'));

    return mergeStream(js, res);
});

gulp.task('test', ['compile'], function() {
    return gulp.src(['app/test/*.js'], { read: false })
        .pipe(mocha({
            reporter: 'spec'
        }));
});

gulp.task('build', ['test']);

gulp.task('watch', function() {
    gulp.watch(watchedFiles, ['compile', 'emulate']);
});

gulp.task('help', function() {
    console.log();
    console.log();
    console.log('    gulp               - run to start watching files and restart');
    console.log('                         default emulator (' + emulator + ') when files change.');
    console.log();
    console.log('    gulp -d <device>   - run with specific emulator.');
    console.log('                         Valid emulators are: ' + validEmulators.join(', '));
    console.log();
    console.log();
});



//tns emulate ios --device iPhone-6
