'use strict';

import {inspect} from './../shared/utils/debug';

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

	let elPageContent = page.getViewById('pagecontent');
	dataList.selectedIndex = navContext.selectedIndex;
	elPageContent.bindingContext = dataList;
}

function menuItemTap(args) {
	var section = args.view.bindingContext;
	frameModule.topmost().navigate({
		moduleName: 'views/details',
		context: {
			data: section,
			selectedIndex: dataList.selectedIndex,
			prevPageTitle: curPageName
		}
	});
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
module.exports.menuItemTap = menuItemTap;

