'use strict';

// What files to monitor - when to rebuild and reload emulator?
var watchedFiles = [
	'app/src/*.{js,xml,css}',
	'app/src/**/*.{js,xml,css}',
    'app/app.js'
];

// Where are your ES6 files which are going to be translated?
// These are also the files which will be linted by eslint
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
var iOSEmulator = 'iPhone-5';
var androidEmulator = 'Nexus-5';

// Images settings
var iconColor = '#879c9c';
var destinationPath = './app/images';
var svgPath = './app/src/images/md/*/svg/production/*_24px.svg';

/**
 * Dependencies
 */
var runSequence = require('run-sequence');

// Build Dependencies
var gulp = require('gulp');
var chalk = require('chalk');
var spawn = require('child_process').spawn;
var babel = require('gulp-babel');
var mocha = require('gulp-mocha');
var mergeStream = require('merge-stream');
var del = require('del');
var eslint = require('gulp-eslint');

// Image Dependencies
var raster = require('gulp-raster');
var rename = require('gulp-rename');
var lazypipe = require('lazypipe');
var clone = require('gulp-clone');
var cheerio = require('gulp-cheerio');
var rimraf = require('gulp-rimraf');

gulp.task('_emulateiOS', function(cb) {
    var child = spawn('tns', ['emulate', 'ios', '--device', iOSEmulator], {cwd: process.cwd()});
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

gulp.task('_emulateAndroid', function(cb) {
    //▶ tns emulate android --geny Nexus-5
    var child = spawn('tns', ['emulate', 'android', '--geny', androidEmulator], {cwd: process.cwd()});
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


gulp.task('lint', function () {
    return gulp.src(babelSrc)
        .pipe(eslint())
        .pipe(eslint.format());
});


gulp.task('watchIOS', function(callback) {
    console.log();
    console.log(chalk.blue('Watcher started, will restart emulator ') + chalk.yellow(iOSEmulator) + chalk.blue(' when files change'));
    console.log('Tip: Run "gulp help" to show help');
    console.log();
    gulp.watch(watchedFiles, function () {
            runSequence(
                '_clean',
                '_compile',
                '_emulateiOS',
                callback);
        }
    );
});

gulp.task('watchAndroid', function(callback) {
    gulp.watch(watchedFiles, function () {
            runSequence(
                '_clean',
                '_compile',
                '_emulateAndroid',
                callback);
        }
    );
});

/**
 * IMAGE TASKS
 */
gulp.task('images', function(callback) {
    runSequence('_cleanImages',
        '_ios1x',
        '_ios2x',
        '_ios3x',
        '_android1x',
        '_android15x',
        '_android2x',
        '_android3x',
        '_android4x',
        callback);
});


gulp.task('_ios1x', function () {
    return gulp.src(svgPath)
        .pipe(rename(function(opt) {
            opt.basename = opt.basename.replace(/_24px$/, '');
            opt.dirname = opt.dirname.replace(/svg\/production$/, '');
            return opt;
        }))
        .pipe(colorize(iconColor))
        .pipe(raster({format: 'png', scale: 1}))
        .pipe(rename({extname: '.png', suffix: ''}))
        .pipe(rename(function(opt) {
            opt.dirname = opt.dirname + '/' + 'ios';
            return opt;
        }))
        .pipe(gulp.dest(destinationPath));
});

gulp.task('_ios2x', function () {
    return gulp.src(svgPath)
        .pipe(rename(function(opt) {
            opt.basename = opt.basename.replace(/_24px$/, '');
            opt.dirname = opt.dirname.replace(/svg\/production$/, '');
            return opt;
        }))
        .pipe(colorize(iconColor))
        .pipe(raster({format: 'png', scale: 2}))
        .pipe(rename({extname: '.png', suffix: '@2x'}))
        .pipe(rename(function(opt) {
            opt.dirname = opt.dirname + '/' + 'ios';
            return opt;
        }))
        .pipe(gulp.dest(destinationPath));
});

gulp.task('_ios3x', function () {
    return gulp.src(svgPath)
        .pipe(rename(function(opt) {
            opt.basename = opt.basename.replace(/_24px$/, '');
            opt.dirname = opt.dirname.replace(/svg\/production$/, '');
            return opt;
        }))
        .pipe(colorize(iconColor))
        .pipe(raster({format: 'png', scale: 3}))
        .pipe(rename({extname: '.png', suffix: '@3x'}))
        .pipe(rename(function(opt) {
            opt.dirname = opt.dirname + '/' + 'ios';
            return opt;
        }))
        .pipe(gulp.dest(destinationPath));
});

gulp.task('_android1x', function () {
    return gulp.src(svgPath)
        .pipe(rename(function(opt) {
            opt.basename = opt.basename.replace(/_24px$/, '');
            opt.dirname = opt.dirname.replace(/svg\/production$/, '');
            return opt;
        }))
        .pipe(colorize(iconColor))
        .pipe(raster({format: 'png', scale: 1}))
        .pipe(rename({extname: '.png'}))
        .pipe(rename(function(opt) {
            opt.dirname = opt.dirname + '/' + 'android/drawable-mdpi';
            return opt;
        }))
        .pipe(gulp.dest(destinationPath));
});

gulp.task('_android15x', function () {
    return gulp.src(svgPath)
        .pipe(rename(function(opt) {
            opt.basename = opt.basename.replace(/_24px$/, '');
            opt.dirname = opt.dirname.replace(/svg\/production$/, '');
            return opt;
        }))
        .pipe(colorize(iconColor))
        .pipe(raster({format: 'png', scale: 1.5}))
        .pipe(rename({extname: '.png'}))
        .pipe(rename(function(opt) {
            opt.dirname = opt.dirname + '/' + 'android/drawable-hdpi';
            return opt;
        }))
        .pipe(gulp.dest(destinationPath));
});

gulp.task('_android2x', function () {
    return gulp.src(svgPath)
        .pipe(rename(function(opt) {
            opt.basename = opt.basename.replace(/_24px$/, '');
            opt.dirname = opt.dirname.replace(/svg\/production$/, '');
            return opt;
        }))
        .pipe(colorize(iconColor))
        .pipe(raster({format: 'png', scale: 2}))
        .pipe(rename({extname: '.png'}))
        .pipe(rename(function(opt) {
            opt.dirname = opt.dirname + '/' + 'android/drawable-xhdpi';
            return opt;
        }))
        .pipe(gulp.dest(destinationPath));
});

gulp.task('_android3x', function () {
    return gulp.src(svgPath)
        .pipe(rename(function(opt) {
            opt.basename = opt.basename.replace(/_24px$/, '');
            opt.dirname = opt.dirname.replace(/svg\/production$/, '');
            return opt;
        }))
        .pipe(colorize(iconColor))
        .pipe(raster({format: 'png', scale: 3}))
        .pipe(rename({extname: '.png'}))
        .pipe(rename(function(opt) {
            opt.dirname = opt.dirname + '/' + 'android/drawable-xxhdpi';
            return opt;
        }))
        .pipe(gulp.dest(destinationPath));
});

gulp.task('_android4x', function () {
    return gulp.src(svgPath)
        .pipe(rename(function(opt) {
            opt.basename = opt.basename.replace(/_24px$/, '');
            opt.dirname = opt.dirname.replace(/svg\/production$/, '');
            return opt;
        }))
        .pipe(colorize(iconColor))
        .pipe(raster({format: 'png', scale: 4}))
        .pipe(rename({extname: '.png'}))
        .pipe(rename(function(opt) {
            opt.dirname = opt.dirname + '/' + 'android/drawable-xxxhdpi';
            return opt;
        }))
        .pipe(gulp.dest(destinationPath));
});



gulp.task('_cleanImages', function() {
    return gulp.src(destinationPath, { read: false })
        .pipe(rimraf());
});


function colorize (color) {
    var sink;
    return (lazypipe()
        .pipe(function () {
            sink = clone.sink();
            return sink;
        })
        .pipe(cheerio, function ($) {
            $('svg').attr('fill', color);
        })
        .pipe(function () {
            return sink.tap();
        })
    )();
}



/**
 * DEFAULT TASK
 */
gulp.task('default', function() {
    console.log();
	console.log(chalk.magenta('  Main tasks'));
    console.log();
    console.log('    ' + chalk.blue('gulp watchIOS') + '            - Start watching files, recompile Javascript and restart');
    console.log('                               emulator (set to: ' + iOSEmulator + ') when files change.');
    console.log();
    console.log('    ' + chalk.blue('gulp watchAndroid') + '        - Start watching files, recompile Javascript and restart');
    console.log('                               emulator (set to: ' + androidEmulator + ') when files change.');
    console.log();
	console.log('    ' + chalk.blue('gulp test') + '                - Clean, compile and run tests in /app/tests');
    console.log();
    console.log('    ' + chalk.blue('gulp lint') + '                - Run eslint');
	console.log();
	console.log(chalk.magenta('  Main tasks'));
	console.log();
	console.log('    ' + chalk.blue('gulp images') + '              - Clean /app/images and regenerates images from SVG');
	console.log();
	console.log(chalk.magenta('  Sub-tasks') + ' (primarily run by main tasks)');
    console.log();
	console.log('    ' + chalk.blue('gulp _clean') + '             - Clean target folders (' + generatedSources.join(', ') + ')');
	console.log();
	console.log('    ' + chalk.blue('gulp _compile') + '           - Compile Javascript');
	console.log();
	console.log('    ' + chalk.blue('gulp _test') + '              - Run tests');
    console.log();
});
