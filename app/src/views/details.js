//'use strict';
//
//import {inspect} from './../shared/utils/debug';
//let customUiModule = require('./../shared/modules/ui');
//import {templatesModel} from './../shared/utils/htmlRenderer';
//let webViewModule = require('ui/web-view');
//
//
//let page;
//
//
//function navigatedTo(args) {
//	page = args.object;
//	let context = page.navigationContext;
//
//	customUiModule.topbar.setText(page, context.item.title);
//
//	//inspect(context.selectedIndex);
//	//inspect(context.item.title);
//	//inspect(context.item.hasType('drugs'));
//	//inspect(context.item.hasType('advice'));
//	//inspect(context.item.getContent(context.selectedIndex));
//
//	let html = `<!DOCTYPE html>
//		<html lang="en">
//		<head>
//			<meta charset="utf-8">
//			<title>REKListan</title>
//			<style>
//			${templatesModel.getCss('custom')}
//			</style>
//		</head>
//		<body>
//			${context.item.getContent(context.selectedIndex)}
//		</body>
//		</html>`;
//
//
//	var webView = page.getViewById('detailsWV');
//	webView.src = html;
//
//	webView.on(webViewModule.WebView.loadStartedEvent, function(e) {
//		inspect(e.url);
//		//if (e.url.indexOf('tjohej://') > -1) {
//		//	e.object.ios.stopLoading();
//		//}
//
//		//var topFrame = FrameModule.topmost();
//		//topFrame.navigate({
//		//	create: function() {
//		//		var testPage2 = new PageModule.Page();
//		//		var webView2 = new webViewModule.WebView();
//		//		webView2.url = 'file:///tmp/hej.html';
//		//		testPage2.content = webView2;
//		//		return testPage2;
//		//	}
//		//});
//
//
//
//		// Todo: Same for android
//		//e.object.ios.stopLoading();
//
//	});
//
//}
//
//
////module.exports.loaded = loaded;
//module.exports.navigatedTo = navigatedTo;
//



'use strict';

import {inspect} from './../shared/utils/debug';

import {templatesModel} from './../shared/utils/htmlRenderer';
import customUi from './../shared/modules/ui';
import ActionBar from './../shared/viewmodel/ActionBar';
const frameModule = require('ui/frame');

let page;
let actionBar;
let dataList;
let curPageName;

function navigatingTo(args) {
	customUi.setViewDefaults();
	page = args.object;
	let navContext = page.navigationContext;
	dataList = navContext.data;
	curPageName = navContext.data.title;


	let enabledTabs = '';
	if (dataList.hasType(0) && dataList.hasType(1)) {
		enabledTabs = 'both';
	} else if (dataList.hasType(0)) {
		enabledTabs = 'drugs';
	} else if (dataList.hasType(1)) {
		enabledTabs = 'advice';
	}

	actionBar = new ActionBar(curPageName, navContext.prevPageTitle, navContext.selectedIndex, enabledTabs);
	let elActionBar = page.getViewById('actionbar');
	elActionBar.bindingContext = actionBar;

	//let elPageContent = page.getViewById('pagecontent');
	//dataList.selectedIndex = navContext.selectedIndex;
	//elPageContent.bindingContext = dataList;

	showVW(navContext.data.getContent(navContext.selectedIndex));
}

function showVW(htmlContent) {

	let html = `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="utf-8">
			<title>REKListan</title>
			<style>
			</style>
		</head>
		<body>
			<h1>HEJ!</h1>
		</body>
		</html>`;

	let webView = page.getViewById('detailsWV');
	webView.src = html;

	inspect(webView.src);


	inspect('SETTING WEBVIEW');
}


function drugsTap() {
	actionBar.selectedIndex = 0;
	dataList.selectedIndex = 0;
}

function adviceTap() {
	actionBar.selectedIndex = 1;
	dataList.selectedIndex = 1;
}

function backTap() {
	let topmost = frameModule.topmost();
	topmost.goBack();
}

module.exports.navigatingTo = navigatingTo;
module.exports.drugsTap = drugsTap;
module.exports.adviceTap = adviceTap;
module.exports.backTap = backTap;

