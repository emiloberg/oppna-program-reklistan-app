'use strict';

//import {time, timeEnd, timePeek, inspect} from './../shared/utils/debug';
import ActionBar from './../shared/viewmodel/ActionBar';
import Mainmenu from './../shared/viewmodel/Mainmenu';
import AppMessage from './../shared/viewmodel/AppMessage';
import * as frameModule from 'ui/frame';

import navigation from './../shared/utils/navigation';

let page;
let actionBar;
let dataList;
let curPageName;

function loaded(args) {
	init(args);
}

function init(args) {
	page = args.object;

	// Elements
	const elPageContent = page.getViewById('pagecontent');
	const elActionBar = page.getViewById('actionbar');
	const elAppMessage = page.getViewById('appmessage');
	const elMenuWrapper = page.getViewById('menuwrapper');

	// Nav context data
	let navContext = page.navigationContext;
	dataList = navContext.data;
	curPageName = navContext.data.title;

	// If the data only exists for one selectedIndex, then we force it to show that selectedIndex
	// no matter if we got another selectedIndex in the navContext/lastSelectedIndex.
	let forceSelectedIndex = -1;
	let enabledTabs = '';
	if (dataList.hasType(0) && dataList.hasType(1)) {
		enabledTabs = 'both';
	} else if (dataList.hasType(0)) {
		enabledTabs = 'drugs';
		forceSelectedIndex = 0;
	} else if (dataList.hasType(1)) {
		enabledTabs = 'advice';
		forceSelectedIndex = 1;
	}
	let selectedIndex = page.navigationContext ? page.navigationContext.selectedIndex : undefined;
	if (forceSelectedIndex > -1) {
		selectedIndex = forceSelectedIndex;
	}


	// Action bar
	actionBar = new ActionBar({
		pageTitle: curPageName,
		backTitle: navContext.prevPageTitle,
		enabledTabs: enabledTabs,
		selectedIndex: selectedIndex
	});
	actionBar.drugsTap = function() { switchTab(0); };
	actionBar.adviceTap = function() { switchTab(1); };
	elActionBar.bindingContext = actionBar;

	// Menu
	elMenuWrapper.bindingContext = Mainmenu.get();

	// App Message
	elAppMessage.bindingContext = AppMessage.get();

	// Main data list
	dataList.set('selectedIndex', actionBar.get('selectedIndex'));
	elPageContent.bindingContext = dataList;

}

function listItemTap(args) {
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

function switchTab(index) {
	actionBar.set('selectedIndex', index);
	dataList.set('selectedIndex', index);
}

module.exports.loaded = loaded;
module.exports.listItemTap = listItemTap;
////module.exports.swipe = function(args) { navigation.swipe(args, curPageName, ['search', 'menu']); };
