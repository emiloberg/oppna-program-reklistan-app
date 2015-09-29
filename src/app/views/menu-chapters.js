'use strict';

import {time, timeEnd, timePeek, inspect} from './../shared/utils/debug';
import ActionBar from './../shared/viewmodel/ActionBar';
import Mainmenu from './../shared/viewmodel/Mainmenu';
import AppMessage from './../shared/viewmodel/AppMessage';
import * as frameModule from 'ui/frame';

import {AbsoluteLayout} from 'ui/layouts/absolute-layout';
import {screen} from 'platform';
const deviceWidth = screen.mainScreen.widthPixels / screen.mainScreen.scale;
const deviceHeight = screen.mainScreen.heightPixels / screen.mainScreen.scale;


let page;
let actionBar;
let dataList;
let curPageName;

function loaded(args) {
	//if (!page) {
		init(args);
	//}
}

function init(args) {
	page = args.object;

	// Elements
	const elPageWrapper = page.getViewById('pagewrapper');
	const elPageContent = page.getViewById('pagecontent');
	const elActionBar = page.getViewById('actionbar');
	const elAppMessage = page.getViewById('appmessage');
	const elMenuWrapper = page.getViewById('menuwrapper');

	// Set size of absolute positioned items.
	elPageWrapper.height = deviceHeight;
	elPageWrapper.width = deviceWidth;
	elPageContent.height = deviceHeight;
	elPageContent.width = deviceWidth;
	elMenuWrapper.height = deviceHeight;
	elMenuWrapper.width = deviceWidth;
	AbsoluteLayout.setLeft(elMenuWrapper, deviceWidth);

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

	// listView list
	dataList.set('selectedIndex', actionBar.get('selectedIndex'));


	elPageContent.bindingContext = dataList;

	// Menu
	elMenuWrapper.bindingContext = Mainmenu.setup(elPageContent, elMenuWrapper);

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

function switchTab(index) {
	actionBar.set('selectedIndex', index);
	dataList.set('selectedIndex', index);
}

module.exports.loaded = loaded;
module.exports.menuItemTap = menuItemTap;
////module.exports.swipe = function(args) { navigation.swipe(args, curPageName, ['search', 'menu']); };
