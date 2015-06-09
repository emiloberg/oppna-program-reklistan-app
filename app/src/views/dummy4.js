'use strict';

import {inspect} from './../shared/utils/debug';
import {templatesModel} from './../shared/utils/htmlRenderer';
import customUi from './../shared/modules/ui';
import navigation from './../shared/utils/navigation';
import RemoteImages from './../shared/utils/remoteimages';

const webViewModule = require('ui/web-view');

let page;
let curPageName;
let wv;
let navContext;

function navigatingTo(args) {
	customUi.setViewDefaults();
	page = args.object;
	navContext = page.navigationContext;

	wv = page.getViewById('webview');
	wv.off(webViewModule.WebView.loadStartedEvent);
	showVW();
}



function showVW() {
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
			<img src="file://${RemoteImages.imageFolderPath()}/_reklistan-theme_images_theme_child.png"
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
module.exports.menuTap = function() {
	navigation.toMenu(curPageName);
};
