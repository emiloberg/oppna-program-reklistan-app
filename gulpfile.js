'use strict';

var watchedFiles = [
	'app/src/*.{js,xml,css}',
	'app/src/**/*.{js,xml,css}'
];

var babelSrc = [
    'app/src/**/*.js'
];
var resources = [
    'app/src/*.{xml,css}',
    'app/src/**/*.{xml,css}'
];

var generatedSources = [
    './app/{shared,test,views}'
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

//var gulp = require('gulp-param')(require('gulp'), process.argv);
var gulp = require('gulp');
var chalk = require('chalk');
var spawn = require('child_process').spawn;
var babel = require('gulp-babel');
var mocha = require('gulp-mocha');
var mergeStream = require('merge-stream');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('_emulate', function(cb) {
    //if (device !== null) {
    //    if (validEmulators.indexOf(device) === -1) {
    //        console.log();
    //        console.log(chalk.red('Error!'));
    //        console.log(chalk.red('"' + device + '" did not match a valid device'));
    //        console.log('Valid devices are: ' + validEmulators.join(', '));
    //        console.log();
    //        return true;
    //    } else {
    //        emulator = device;
    //    }
    //}

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
    console.log('                               default emulator (' + emulator + ') when files change.');
	console.log('    ' + chalk.blue('gulp watch -d ') + chalk.yellow('<device>') + '   - run with specific emulator.');
    console.log();
	console.log('    ' + chalk.blue('gulp build') + '               - Clean target folder, rebuild Javascript and run tests');
    console.log();
	console.log(chalk.magenta('  Sub-tasks') + ' (primarily run by main tasks)');
    console.log();
	console.log('    ' + chalk.blue('gulp test') + '                - Run tests');
	console.log();
	console.log('    ' + chalk.blue('gulp compile') + '             - Compile Javascript');
	console.log();
	console.log('    ' + chalk.blue('gulp emulate') + '             - Run default emulator (' + emulator + ')');
	console.log('    ' + chalk.blue('gulp emulate -d ') + chalk.yellow('<device>') + ' - Run specific emulator.');
    console.log();
	console.log(chalk.magenta('  Emulators'));
    console.log();
	console.log('    Valid emulators are: ' + chalk.yellow(validEmulators.join(', ')));
    console.log();
});
