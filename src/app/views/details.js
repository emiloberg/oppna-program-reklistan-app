'use strict';

//import {inspect} from './../shared/utils/debug';

import {templatesModel} from './../shared/utils/htmlRenderer';
import customUi from './../shared/modules/ui';
import ActionBar from './../shared/viewmodel/ActionBar';
import navigation from './../shared/utils/navigation';
import {android, ios} from 'application';
import Mainmenu from './../shared/viewmodel/Mainmenu';
import AppMessage from './../shared/viewmodel/AppMessage';

const webViewModule = require('ui/web-view');

let page;
let actionBar;
let curPageName;
let wv;
let navContext;

function loaded(args) {
	customUi.setViewDefaults();
	page = args.object;
	Mainmenu.setup(page.getViewById('maincontent'), page.getViewById('menuwrapper'));
	navContext = page.navigationContext;
	curPageName = navContext.data.title;

	let elActionBar = page.getViewById('actionbar');
	let htmlData;

	wv = page.getViewById('detailsWV');
	wv.off(webViewModule.WebView.loadStartedEvent);
	wv.on(webViewModule.WebView.loadStartedEvent, function (event) {
		interjectLink(event);
	});

	const elMenu = page.getViewById('menuwrapper');
	elMenu.bindingContext = Mainmenu.setup(page.getViewById('maincontent'), elMenu);

	const elAppMessage = page.getViewById('appmessage');
	elAppMessage.bindingContext = AppMessage.setup(elAppMessage);

	if(navContext.type === 'plainArticle') { // Is a plain article, e.g. resource article
		actionBar = new ActionBar({
			pageTitle: curPageName,
			useLastPageTitle: true,
			enabledTabs: 'none'
		});
		elActionBar.bindingContext = actionBar;
		htmlData = `
		<div class="mobile-container">
		<div class="screen active">
		<div class="section-details">
		${navContext.data.body}
		</div>
		</div>
		</div>`;

	} else { // Is drugs/advice article

		let enabledTabs = '';
		if (navContext.data.hasType(0) && navContext.data.hasType(1)) {
			enabledTabs = 'both';
		} else if (navContext.data.hasType(0)) {
			enabledTabs = 'drugs';
		} else if (navContext.data.hasType(1)) {
			enabledTabs = 'advice';
		}

		actionBar = new ActionBar({
			pageTitle: curPageName,
			backTitle: navContext.prevPageTitle,
			enabledTabs: enabledTabs,
			selectedIndex: page.navigationContext ? page.navigationContext.selectedIndex : undefined
		});
		elActionBar.bindingContext = actionBar;
		htmlData = navContext.data.getContent(actionBar.get('selectedIndex'));

		setTab(actionBar.get('selectedIndex'));
	}

	showVW(htmlData);
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
		navigation.navigateToExternalUrl(linkObj.url);
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
	if (actionBar.get('selectedIndex') !== index) {
		actionBar.selectedIndex = index;
		navContext.selectedIndex = index;
		showVW(navContext.data.getContent(index));
	}
}

module.exports.loaded = loaded;
module.exports.drugsTap = function drugsTap() { setTab(0); };
module.exports.adviceTap = function adviceTap() { setTab(1); };
module.exports.backTap = navigation.back;
module.exports.swipe = function(args) {
	navigation.swipe(args, curPageName);
};
module.exports.searchTap = function() {
	navigation.toSearch(curPageName);
};
module.exports.menuTap = Mainmenu.show;
module.exports.hideMenuTap = Mainmenu.hide;
module.exports.swipeMenu = function(args) {
	Mainmenu.swipe(args);
};
module.exports.logoTap = Mainmenu.logoTap;
module.exports.reloadDataTap = Mainmenu.reloadDataTap;
