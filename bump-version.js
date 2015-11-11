var semver = require('semver');
var validator = require('validator');
var fs = require('fs');

var files = {
	source: {
		ios: './resources/app-settings/rekapp-Info.plist',
		android: './resources/app-settings/AndroidManifest.xml'
	},
	target: {
		ios: './rekapp/platforms/ios/rekapp/rekapp-Info.plist',
		android: './rekapp/platforms/android/src/main/AndroidManifest.xml'
	}
};

var platform = process.argv[2];
var versionnumber = process.argv[3];
var versionname = process.argv[4];

if (platform === 'ios') {

	if (semver.valid(versionnumber) === null) { printHelpAndExit(); }

	var iosFile = fs.readFileSync(files.source.ios, { encoding: 'utf8' });
	iosFile = iosFile.replace(/REPLACEVERSIONCODE/g, versionnumber);
	fs.writeFileSync(files.target.ios, iosFile, { encoding: 'utf8' });

	console.log('Bumped version to ' + versionnumber + ' (file: ' + files.target.ios + ')');

} else if (platform === 'android') {

	if (validator.isInt(versionnumber) !== true) { printHelpAndExit(); }
	versionnumber = parseInt(versionnumber, 10);

	if (validator.isLength(versionname, 2, 10) !== true) { printHelpAndExit(); }
	var versionSeries = versionname.split('.');
	if (versionSeries.length !== 2) { printHelpAndExit(); }
	versionSeries.forEach(function(part) {
		if (validator.isInt(part) !== true) { printHelpAndExit(); }
	});

	var androidFile = fs.readFileSync(files.source.android, { encoding: 'utf8' });
	androidFile = androidFile.replace(/REPLACEVERSIONCODE/g, versionnumber);
	androidFile = androidFile.replace(/REPLACEVERSIONNAME/g, versionname);
	fs.writeFileSync(files.target.android, androidFile, { encoding: 'utf8' });

	console.log('Bumped version to ' + versionnumber + '/' + versionname +' (file: ' + files.target.android + ')');

} else {
	printHelpAndExit();
}

function printHelpAndExit() {
	console.log('-----------------------------------');
	console.log('');
	console.log('For iOS run as:');
	console.log('   npm run bump ios <semver version code>');
	console.log('');
	console.log('For Android run as:');
	console.log('   npm run bump android <integer version code> <X.Y version name>');
	console.log('');
	console.log('-----------------------------------');
	process.exit(1);
}
