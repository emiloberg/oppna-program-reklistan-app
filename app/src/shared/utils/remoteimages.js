import http from 'http';
import fs from 'file-system';
import fsAccess from 'file-system/file-system-access';
import {ImageFormat} from 'ui/enums';
import {inspect} from './debug';

const IMAGE_FOLDER = fs.knownFolders.documents().getFolder('images');
const IMAGE_FOLDER_PATH = IMAGE_FOLDER.path;

const imgRequests = [];
let pending = 0;
let knownImages = {};
const maxSimultaneousDownloadThreads = 5;


/**
 * Clear the image folder
 */
const clearImageFolder = () => {
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
const initKnownImages = () => {
	return new Promise((resolve/*, reject*/) => {
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
const queueImageForDownload = (spec) => {
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
const _downloadNextImage = (spec) => {
	pending++;
	return http.getImage(spec.url)
		.then(img => {
			saveImage(spec.filename, img);
			pending--;
			if (imgRequests.length > 0) {
				_downloadNextImage(imgRequests.shift());
			}
		})
		.catch(() => {
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
const saveImage = (filename, image) => {
	let outPath = fs.path.join(IMAGE_FOLDER_PATH, filename);
	//console.log(outPath);
	return new Promise((resolve, reject) => {
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
const imageFolderPath = () => {
	return IMAGE_FOLDER_PATH;
};

const RemoteImages = {
	queueImageForDownload,
	initKnownImages,
	clearImageFolder,
	imageFolderPath
};

export default RemoteImages;

