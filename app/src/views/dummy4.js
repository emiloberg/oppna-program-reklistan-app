'use strict';

import {inspect} from './../shared/utils/debug';
import fs from 'file-system';
import {templatesModel} from './../shared/utils/htmlRenderer';
import customUi from './../shared/modules/ui';
import ActionBar from './../shared/viewmodel/ActionBar';
import navigation from './../shared/utils/navigation';
import {android, ios} from 'application';

const webViewModule = require('ui/web-view');

let page;
let actionBar;
let curPageName;
let wv;
let navContext;

function navigatingTo(args) {
	customUi.setViewDefaults();
	page = args.object;
	navContext = page.navigationContext;

	wv = page.getViewById('webview');
	wv.off(webViewModule.WebView.loadStartedEvent);
	showVW('/cat.jpg');
}

function showVW(path) {
	const docsFolder = fs.knownFolders.documents().path;
	wv.src = `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, user-scalable=0;" />
			<title>REKListan</title>
			<style>
			${templatesModel.getCss('custom')}
			</style>
		</head>
		<body style="background-color: #ffffff;">
			<img src="file://${docsFolder}${path}"
		</body>
		</html>`;
}

module.exports.navigatingTo = navigatingTo;
module.exports.backTap = navigation.back;
module.exports.swipe = function(args) {
	navigation.swipe(args, curPageName);
};
module.exports.searchTap = function() {
	navigation.toSearch(curPageName);
};
