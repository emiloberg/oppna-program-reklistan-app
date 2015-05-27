'use strict';

import {inspect} from './../shared/utils/debug';

import {templatesModel} from './../shared/utils/htmlRenderer';
import customUi from './../shared/modules/ui';
import ActionBar from './../shared/viewmodel/ActionBar';
import navigation from './../shared/utils/navigation';
import {android, ios} from 'application';

const webViewModule = require('ui/web-view');
//const frameModule = require('ui/frame');

let page;
let actionBar;
let curPageName;
let wv;
let navContext;

function navigatingTo(args) {
	customUi.setViewDefaults();
	page = args.object;
	navContext = page.navigationContext;
	curPageName = navContext.data.title;


	let enabledTabs = '';
	if (navContext.data.hasType(0) && navContext.data.hasType(1)) {
		enabledTabs = 'both';
	} else if (navContext.data.hasType(0)) {
		enabledTabs = 'drugs';
	} else if (navContext.data.hasType(1)) {
		enabledTabs = 'advice';
	}
	actionBar = new ActionBar(curPageName, navContext.prevPageTitle, navContext.selectedIndex, enabledTabs);
	let elActionBar = page.getViewById('actionbar');
	elActionBar.bindingContext = actionBar;


	wv = page.getViewById('detailsWV');

	wv.on(webViewModule.WebView.loadStartedEvent, function(event) {
		interjectLink(event);
	});

	showVW(navContext.data.getContent(navContext.selectedIndex));
}

function interjectLink(event) {
	let linkType;
	let link;
	if (ios) {
		if (event.url.indexOf('applewebdata://') === 0 ) {
			event.object.ios.stopLoading();
			link = event.url.substr(event.url.indexOf('#/'));
			linkType = 'internal';
		}
	} else {
		// Todo Implement for Android
		//event.object.android.stopLoading();
		inspect(event.url);
	}

	if (linkType === 'internal') {
		inspect(link);
	}


	///app/shared/utils/debug.js:30:13: CONSOLE LOG 'applewebdata://3C4C6A36-E8F1-450C-B13E-0CFCFDC6527F#/advice/Fysisk_aktivitet'

	//if (e.url.indexOf('tjohej://') > -1) {
	//	e.object.ios.stopLoading();
	//}

	//var topFrame = FrameModule.topmost();
	//topFrame.navigate({
	//	create: function() {
	//		var testPage2 = new PageModule.Page();
	//		var webView2 = new webViewModule.WebView();
	//		webView2.url = 'file:///tmp/hej.html';
	//		testPage2.content = webView2;
	//		return testPage2;
	//	}
	//});

	//e.object.ios.stopLoading();
	//e.object.android.stopLoading();
}

function showVW(htmlContent) {
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
			${htmlContent}
		</body>
		</html>`;
}


function setTab(index) {
	if (navContext.selectedIndex !== index) {
		actionBar.selectedIndex = index;
		navContext.selectedIndex = index;
		showVW(navContext.data.getContent(index));
	}
}

module.exports.navigatingTo = navigatingTo;
module.exports.drugsTap = function drugsTap() { setTab(0); };
module.exports.adviceTap = function adviceTap() { setTab(1); };
module.exports.backTap = navigation.back;
module.exports.swipe = navigation.swipe;
