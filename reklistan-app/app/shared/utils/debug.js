'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.inspect = inspect;
exports.saveFile = saveFile;
exports.debug = debug;
exports.getDebugLog = getDebugLog;
exports.clearDebugLog = clearDebugLog;
exports.removeLocalCache = removeLocalCache;
exports.removeLocalImages = removeLocalImages;
exports.removeLocalFiles = removeLocalFiles;

var _dataObservable = require('data/observable');

var _dataObservableArray = require('data/observable-array');

var eyes = require('./../../thirdparty/eyes');
var fs = require('file-system');

var DEBUG_LOG = new _dataObservableArray.ObservableArray([]);
var DEBUG_OBJ = new _dataObservable.Observable({
	log: DEBUG_LOG
});

function inspect(something) {
	console.log(eyes.inspect(something));
	return something;
}

function saveFile(filename, content) {
	var root = '/tmp/';
	var path = fs.path.join(root, filename);
	var file = fs.File.fromPath(path);

	file.writeText(content).then(function () {}, function () {
		throw new Error('Could not write file!');
	});
}

function debug(msg) {
	var type = arguments.length <= 1 || arguments[1] === undefined ? 'info' : arguments[1];

	var currentdate = new Date();
	var time = '[' + (currentdate.getHours() < 10 ? '0' : '') + currentdate.getHours() + ':' + (currentdate.getMinutes() < 10 ? '0' : '') + currentdate.getMinutes() + ':' + (currentdate.getSeconds() < 10 ? '0' : '') + currentdate.getSeconds() + '] ';

	msg = time + msg;

	if (type === 'error') {
		msg = '## [ERROR] ' + msg;
	}

	console.log(msg);
	DEBUG_LOG.unshift(msg);
}

function getDebugLog() {
	return DEBUG_OBJ;
}

function clearDebugLog() {
	while (DEBUG_LOG.length > 0) {
		DEBUG_LOG.pop();
	}
}

function removeLocalCache() {
	removeLocalFolder('rekcache');
}

function removeLocalImages() {
	removeLocalFolder('images');
}

function removeLocalFiles() {
	removeLocalFolder('images');
	removeLocalFolder('rekcache');
}

function removeLocalFolder(folder) {
	var fsFolder = fs.knownFolders.documents().getFolder(folder);
	fsFolder.clear().then(function () {
		debug('Removed local folder: ' + folder);
	}, function () {
		debug('Could not remove local folder: ' + folder, 'error');
	});
}