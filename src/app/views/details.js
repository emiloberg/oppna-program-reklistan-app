'use strict';

//import {time, timeEnd, timePeek, inspect} from './../shared/utils/debug';
import ActionBar from './../shared/viewmodel/ActionBar';
import Mainmenu from './../shared/viewmodel/Mainmenu';
import AppMessage from './../shared/viewmodel/AppMessage';
import * as frameModule from 'ui/frame';
import * as webViewModule from 'ui/web-view';
import {android, ios} from 'application';
import {templatesModel} from './../shared/utils/htmlRenderer';
import navigation from './../shared/utils/navigation';
import * as gridLayout from 'ui/layouts/grid-layout';
import screenDimensions from './../shared/utils/screenDimensions';
import {AbsoluteLayout} from 'ui/layouts/absolute-layout';

var email = require("nativescript-email");

let page;
let actionBar;
let curPageName;
let wv;
let navContext;

function loaded(args) {
	//if (!page) {
	init(args);
	//}
}

function init(args) {
	page = args.object;

	let htmlData;

	// Elements
	const elPageWrapper = page.getViewById('pagewrapper');
	const elPageContent = page.getViewById('pagecontent');
	const elActionBar = page.getViewById('actionbar');
	const elAppMessage = page.getViewById('appmessage');
	const elMenuWrapper = page.getViewById('menuwrapper');

	// Set size of absolute positioned items.
	elPageWrapper.height = screenDimensions.height;
	elPageWrapper.width = screenDimensions.width;
	elPageContent.height = screenDimensions.height;
	elPageContent.width = screenDimensions.width;
	elMenuWrapper.height = screenDimensions.height;
	elMenuWrapper.width = screenDimensions.width;
	AbsoluteLayout.setLeft(elMenuWrapper, screenDimensions.width);

	// Nav context data
	navContext = page.navigationContext;
	curPageName = navContext.data.title;

	// Setup WebView
	wv = new webViewModule.WebView();
	wv.off(webViewModule.WebView.loadStartedEvent);
	wv.on(webViewModule.WebView.loadStartedEvent, function (event) {
		interjectLink(event);
	});

	// setTimeout as this takes ~300ms on an Android device and we don't want to
	// block the ui while adding it.
	if (android) {
		setTimeout(() => {
			// Todo: Maybe add some fade in
			displayWebView();
		}, 0);
	} else {
		displayWebView();
	}

	function displayWebView() {
		const grid = page.getViewById('pagecontent');
		gridLayout.GridLayout.setColumn(wv, 0);
		gridLayout.GridLayout.setRow(wv, 1);
		grid.addChild(wv);
	}

	if(navContext.type === 'plainArticle') { // Is a plain article, e.g. resource article
		actionBar = new ActionBar({
			pageTitle: curPageName,
			useLastPageTitle: true,
			enabledTabs: 'none'
		});
		actionBar.drugsTap = function() { switchTab(0); };
		actionBar.adviceTap = function() { switchTab(1); };
		elActionBar.bindingContext = actionBar;
		htmlData = `
		<div class="mobile-container">
		<div class="screen active">
		<div class="section-details section-details-generic">
		${navContext.data.body}
		</div>
		</div>
		</div>`;

	} else { // Is drugs/advice article

		// If the data only exists for one selectedIndex, then we force it to show that selectedIndex
		// no matter if we got another selectedIndex in the navContext/lastSelectedIndex.
		let forceSelectedIndex = -1;
		let enabledTabs = '';
		if (navContext.data.hasType(0) && navContext.data.hasType(1)) {
			enabledTabs = 'both';
		} else if (navContext.data.hasType(0)) {
			enabledTabs = 'drugs';
			forceSelectedIndex = 0;
		} else if (navContext.data.hasType(1)) {
			enabledTabs = 'advice';
			forceSelectedIndex = 1;
		}
		let selectedIndex = page.navigationContext ? page.navigationContext.selectedIndex : undefined;
		if (forceSelectedIndex > -1) {
			selectedIndex = forceSelectedIndex;
		}

		actionBar = new ActionBar({
			pageTitle: curPageName,
			backTitle: navContext.prevPageTitle,
			enabledTabs: enabledTabs,
			selectedIndex: selectedIndex
		});
		actionBar.drugsTap = function() { switchTab(0); };
		actionBar.adviceTap = function() { switchTab(1); };
		elActionBar.bindingContext = actionBar;

		htmlData = navContext.data.getContent(actionBar.get('selectedIndex'));
		htmlData = `<div class="mobile-details mobile-details-${enabledTabs}">${htmlData}</div>`;

		switchTab(actionBar.get('selectedIndex'));
	}

	showVW(htmlData);

	// Menu
	// As this binding takes like 300ms for some reason, we bind it after the page has loaded
	// and hopes that the user doesn't press the menu before that.
	setTimeout(function() {
		elMenuWrapper.bindingContext = Mainmenu.setup(elPageContent, elMenuWrapper);
	}, 1000);

	// App Message
	elAppMessage.bindingContext = AppMessage.get();

}

function menuItemTap(args) {
	const section = args.view.bindingContext;
	const linkToArticle = section.isLinkToArticle(actionBar.get('selectedIndex'));
	if (linkToArticle) {
		navigation.navigateToUrl(linkToArticle, curPageName);
	} else {
		frameModule.topmost().navigate({
			moduleName: 'views/details',
			context: {
				data: section,
				prevPageTitle: curPageName
			}
		});
	}
}

function interjectLink(event) {
	let isNavigation = false;
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
			isNavigation = true;
		}
	});

	if (linkObj.internal || linkObj.external) {
		if (ios) {
			event.object.ios.stopLoading();
		} else if (android) {
			event.object.android.stopLoading();
		}
	}

	if (isNavigation) {
		if (linkObj.internal) {
			navigation.navigateToUrl(linkObj.url, curPageName);
		} else if (linkObj.external) {
			navigation.navigateToExternalUrl(linkObj.url);
		}
	}

	// Check if mail url
	var reSrc = /rekmail:([^\?]+)/gi;
	var match = reSrc.exec(event.url);
	if (match) {
		email.available().then(function(avail) {
			if (avail) {
				email.compose({
					subject: 'Från REKlistan',
					body: '',
					to: [match[1]]
				});
			}
		});
	}

}

function showVW(htmlContent) {
	wv.src = `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, user-scalable=0" />
			<title>REKListan</title>
			<script>
			${templatesModel.getInAppResource('appDetailsJs')}
			</script>
			<style>
			${templatesModel.getCss('custom')}
			</style>
		</head>
		<body style="background-color: #ffffff;" class="is-mobile is-mobile-small">
			${htmlContent}
		</body>
		</html>`;
}


function switchTab(index) {
	if (actionBar.get('selectedIndex') !== index) {
		actionBar.selectedIndex = index;
		navContext.selectedIndex = index;
		showVW(navContext.data.getContent(index));
	}
}


module.exports.loaded = loaded;
module.exports.menuItemTap = menuItemTap;
////module.exports.swipe = function(args) { navigation.swipe(args, curPageName, ['search', 'menu']); };
