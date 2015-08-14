'use strict';

import * as debug from './../shared/utils/debug';
import customUi from './../shared/modules/ui';
import ActionBar from './../shared/viewmodel/ActionBar';
import navigation from './../shared/utils/navigation';
var frameModule = require('ui/frame');
import {shareText} from 'nativescript-social-share';
var dialogs = require("ui/dialogs");
import {device, screen} from 'platform';

function navigatingTo(args) {
	customUi.setViewDefaults();
	let page = args.object;
	let navContext = page.navigationContext;

	let actionBar = new ActionBar('', navContext.prevPageTitle, 0);
	let elActionBar = page.getViewById('actionbar');
	elActionBar.bindingContext = actionBar;

	let elLog = page.getViewById('log');
	elLog.bindingContext = debug.getDebugLog();
}

function shareLog() {

	const now = new Date();

	let logStr = `
	Date: ${now}

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
}

function downloadData() {
	frameModule.topmost().navigate('views/download-data');
}

module.exports.navigatingTo = navigatingTo;
module.exports.backTap = navigation.back;
module.exports.swipe = function(args) {
	navigation.swipe(args, '', ['back']);
};
module.exports.removeLocalFilesTap = debug.removeLocalFiles;
module.exports.removeLocalImagesTap = debug.removeLocalImages;
module.exports.removeLocalCacheTap = debug.removeLocalCache;
module.exports.clearDebugLogTap = debug.clearDebugLog;
module.exports.downloadData = downloadData;
module.exports.shareLog = shareLog;
