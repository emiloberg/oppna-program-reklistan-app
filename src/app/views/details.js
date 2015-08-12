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


	// UIView *view1 = [[UIView alloc] init];
	// var view1 = UIView.alloc().init();


	//NSURL *url=[[NSBundle mainBundle] bundleURL];
	//[webView loadHTMLString:string baseURL:url];

	//NSUrl url = NSBundle.mainBundle().bundleURL();
	//webView.loadHTMLStringWithBaseURL(String, url);

	//	var baseUrl = UIView.alloc().init();


	wv = page.getViewById('detailsWV');
	wv.off(webViewModule.WebView.loadStartedEvent);
	wv.on(webViewModule.WebView.loadStartedEvent, function(event) {
		interjectLink(event);
	});

	showVW(navContext.data.getContent(navContext.selectedIndex));

	inspect('Navigating to: ' + navContext.data.id);

}

function interjectLink(event) {

	let linkObj = {
		url: '',
		internal: false,
		external: false
	};

	[{
		protocol: 'rek://',
		type: 'internal',
		prefix: ''
	}, {
		protocol: 'rekhttps://',
		type: 'external',
		prefix: 'https://'
	}, {
		protocol: 'rekhttp://',
		type: 'external',
		prefix: 'http://'
	}]
	.forEach(linkType => {
		if (event.url.indexOf(linkType.protocol) === 0) {
			linkObj.url = linkType.prefix + event.url.substr(linkType.protocol.length);
			linkObj[linkType.type] = true;
		}
	});

	if (linkObj.internal || linkObj.external) {
		if (ios) {
			event.object.ios.stopLoading();
		} else if (android) {
			event.object.android.stopLoading();
		}
	}

	if (linkObj.internal) {
		navigation.navigateToUrl(linkObj.url, curPageName);
	} else if (linkObj.external) {
		navigation.navigateToExternalUrl(linkObj.url, curPageName);
	}


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
module.exports.swipe = function(args) {
	navigation.swipe(args, curPageName);
};
module.exports.searchTap = function() {
	navigation.toSearch(curPageName);
};
module.exports.menuTap = function() {
	navigation.toMenu(curPageName);
};
