'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _fileSystem = require('file-system');

var _fileSystem2 = _interopRequireDefault(_fileSystem);

var _debug = require('./debug');

var IMAGE_FOLDER = _fileSystem2['default'].knownFolders.documents().getFolder('images');
var IMAGE_FOLDER_PATH = IMAGE_FOLDER.path;

var imgRequests = [];
var pending = 0;
var knownImages = {};
var maxSimultaneousDownloadThreads = 5;

/**
 * Clear the image folder
 */
var clearImageFolder = function clearImageFolder() {
	IMAGE_FOLDER.clear().then(function () {
		return true;
	}, function (error) {
		return new Error(error);
	});
};

/**
 * Read file system and create a collection of known images
 * Must be run before images are downloaded.
 *
 * @returns {Promise}
 */
var initKnownImages = function initKnownImages() {
	return new Promise(function (resolve /*, reject*/) {
		knownImages = {};
		IMAGE_FOLDER.getEntities().then(function (entities) {
			entities.forEach(function (entity) {
				knownImages[entity.name] = true;
			});
			resolve();
		}, function () {
			resolve(); //Silent error
		});
	});
};

/**
 * Check if image is already on disk and if not, will add it to  the queue of files
 * to be downloaded.
 *
 * @param {Object} spec
 * @param {String} spec.url Url to download image from
 * @param {String} spec.filename filename to save image as.
 */
var queueImageForDownload = function queueImageForDownload(spec) {
	if (knownImages[spec.filename] !== true) {
		knownImages[spec.filename] = true;
		if (pending > maxSimultaneousDownloadThreads) {
			imgRequests.push(spec);
		} else {
			_downloadNextImage(spec);
		}
	}
};

/**
 * Download an image
 *
 * @param {Object} spec
 * @param {String} spec.url Url to download image from
 * @param {String} spec.filename filename to save image as.
 * @returns {Promise}
 * @private
 */
var _downloadNextImage = function _downloadNextImage(spec) {
	(0, _debug.debug)('Downloading image: ' + spec.url);
	pending++;
	return _http2['default'].getImage(spec.url).then(function (img) {
		(0, _debug.debug)('Downloaded image: ' + spec.url);
		saveImage(spec.filename, img);
		pending--;
		if (imgRequests.length > 0) {
			_downloadNextImage(imgRequests.shift());
		}
	})['catch'](function (err) {
		(0, _debug.debug)('Could not download image: ' + spec.url + ' Error: ' + err);
		pending--;
		if (imgRequests.length > 0) {
			_downloadNextImage(imgRequests.shift());
		}
	});
};

/**
 * Save image to disk
 * @param filename
 * @param image
 * @returns {Promise}
 */
var saveImage = function saveImage(filename, image) {
	var outPath = _fileSystem2['default'].path.join(IMAGE_FOLDER_PATH, filename);
	//console.log(outPath);
	return new Promise(function (resolve, reject) {
		if (image.saveToFile(outPath, 'png')) {
			resolve();
		} else {
			reject();
		}
	});
};

/**
 * Get the image folder path.
 *
 * @returns {String} Image Folder Path
 */
var imageFolderPath = function imageFolderPath() {
	return IMAGE_FOLDER_PATH;
};

var RemoteImages = {
	queueImageForDownload: queueImageForDownload,
	initKnownImages: initKnownImages,
	clearImageFolder: clearImageFolder,
	imageFolderPath: imageFolderPath
};

exports['default'] = RemoteImages;
module.exports = exports['default'];