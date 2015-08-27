'use strict';

import * as debug from './../shared/utils/debug';
import customUi from './../shared/modules/ui';
import ActionBar from './../shared/viewmodel/ActionBar';
import navigation from './../shared/utils/navigation';
import {shareText} from 'nativescript-social-share';
import {device, screen} from 'platform';
var appversion = require('nativescript-appversion');
var fs = require('file-system');
import Metadata from './../shared/viewmodel/Metadata';
import * as appSettings from 'application-settings';

function loaded(args) {
	customUi.setViewDefaults();
	let page = args.object;

	let actionBar = new ActionBar();
	let elActionBar = page.getViewById('actionbar');
	elActionBar.bindingContext = actionBar;

	let elLog = page.getViewById('log');
	elLog.bindingContext = debug.getDebugLog();
}

function shareLog() {
	appversion.getVersionName().then(function(v) {
		const now = new Date();

		let logStr = `
		Date: ${now}

		AppVersion: ${v}

		Device model: ${device.model}
		Device type: ${device.deviceType}
		OS: ${device.os}
		OS version: ${device.osVersion}
		SDK Version: ${device.sdkVersion}
		Language: ${device.language}

		Screen width: ${screen.mainScreen.widthPixels}
		Screen height: ${screen.mainScreen.heightPixels}
		Screen scale: ${screen.mainScreen.scale}
		`;

		logStr = logStr + debug.getDebugLog().get('log').join('\n');
		shareText(logStr);
	});
}


function removeLocalCache() {
	Metadata.removeDataUpdated();
	return removeLocalFolder('rekcache');
}

function removeLocalImages() {
	return removeLocalFolder('images');
}

function removeLocalFiles() {
	return removeLocalFolder('images')
		.then(function() {
			return removeLocalCache();
		});
}

function removeLocalFolder(folder) {
	return new Promise((resolve/*, reject*/) => {
		const fsFolder = fs.knownFolders.documents().getFolder(folder);
		fsFolder.clear()
			.then(function () {
				debug.debug('Removed local folder: ' + folder);
				resolve();
			}, function () {
				debug.debug('Could not remove local folder: ' + folder, 'error');
				resolve();
			});
	});
}

function removeDataLocation() {
	appSettings.setNumber('companyId', 0);
	appSettings.setString('groupName', '');
	appSettings.setNumber('drugsStructureId', 0);
	appSettings.setNumber('adviceStructureId', 0);
	appSettings.setNumber('resourcesStructureId', 0);
	appSettings.setNumber('newsStructureId', 0);
	appSettings.setString('locale', '');
	debug.debug('Removed dataLocation');
}



module.exports.loaded = loaded;
module.exports.backTap = navigation.back;
module.exports.swipe = function(args) {
	navigation.swipe(args, '', ['back']);
};
module.exports.removeLocalFilesTap = removeLocalFiles;
module.exports.removeLocalImagesTap = removeLocalImages;
module.exports.removeLocalCacheTap = removeLocalCache;
module.exports.removeDataLocationTap = removeDataLocation;
module.exports.clearDebugLogTap = debug.clearDebugLog;
module.exports.shareLog = shareLog;
