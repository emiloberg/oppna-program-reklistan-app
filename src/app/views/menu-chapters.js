'use strict';

//import {inspect} from './../shared/utils/debug';

import customUi from './../shared/modules/ui';
import ActionBar from './../shared/viewmodel/ActionBar';
import navigation from './../shared/utils/navigation';
import Mainmenu from './../shared/viewmodel/Mainmenu';
import AppMessage from './../shared/viewmodel/AppMessage';
const frameModule = require('ui/frame');

let page;
let actionBar;
let dataList;
let curPageName;

function loaded(args) {
	customUi.setViewDefaults();
	page = args.object;
	Mainmenu.setup(page.getViewById('maincontent'), page.getViewById('menuwrapper'));
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

	actionBar = new ActionBar({
		pageTitle: curPageName,
		backTitle: navContext.prevPageTitle,
		enabledTabs: enabledTabs,
		selectedIndex: page.navigationContext ? page.navigationContext.selectedIndex : undefined
	});
	let elActionBar = page.getViewById('actionbar');
	elActionBar.bindingContext = actionBar;

	let elPageContent = page.getViewById('pagecontent');

	dataList.selectedIndex = actionBar.get('selectedIndex');
	elPageContent.bindingContext = dataList;

	const elMenu = page.getViewById('menuwrapper');
	elMenu.bindingContext = Mainmenu.setup(page.getViewById('maincontent'), elMenu);

	const elAppMessage = page.getViewById('appmessage');
	elAppMessage.bindingContext = AppMessage.setup(elAppMessage);

	switchTab(actionBar.get('selectedIndex'));
}

function menuItemTap(args) {
	var section = args.view.bindingContext;
	frameModule.topmost().navigate({
		moduleName: 'views/details',
		context: {
			data: section,
			prevPageTitle: curPageName
		}
	});
}

function switchTab(index) {
	actionBar.set('selectedIndex', index);
	dataList.set('selectedIndex', index);
}

module.exports.loaded = loaded;
module.exports.drugsTap = function() {
	switchTab(0);
};
module.exports.adviceTap = function() {
	switchTab(1);
};
module.exports.menuItemTap = menuItemTap;
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
