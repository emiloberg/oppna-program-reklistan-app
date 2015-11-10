'use strict';

import ActionBar from './../shared/viewmodel/ActionBar';
import Mainmenu from './../shared/viewmodel/Mainmenu';
import AppMessage from './../shared/viewmodel/AppMessage';
import * as frameModule from 'ui/frame';

import {appViewModel} from './../shared/viewmodel/RekAppViewModel';
import customUi from './../shared/modules/ui';
import language from './../shared/utils/language';
//import {time, timeEnd, timePeek, inspect, debug} from './../shared/utils/debug';


let page;
let actionBar;
let dataList;
let curPageName = language.appTitle;

function loaded(args) {
	init(args);
}

function init(args) {
	customUi.setViewDefaults();
	page = args.object;

	Mainmenu.setup();

	// Elements
	const elPageContent = page.getViewById('pagecontent');
	const elActionBar = page.getViewById('actionbar');
	const elAppMessage = page.getViewById('appmessage');
	const elMenuWrapper = page.getViewById('menuwrapper');

	// Action bar
	actionBar = new ActionBar({
		pageTitle: curPageName,
		selectedIndex: page.navigationContext ? page.navigationContext.selectedIndex : undefined
	});
	actionBar.drugsTap = function() { switchTab(0); };
	actionBar.adviceTap = function() { switchTab(1); };
	elActionBar.bindingContext = actionBar;

	// Menu
	elMenuWrapper.bindingContext = Mainmenu.get();

	// App Message
	elAppMessage.bindingContext = AppMessage.get();

	// Main data list
	dataList = appViewModel.getMainDataList();
	dataList.set('selectedIndex', actionBar.get('selectedIndex'));
	elPageContent.bindingContext = dataList;
}

function listItemTap(args) {
    var section = args.view.bindingContext;
    frameModule.topmost().navigate({
        moduleName: 'views/menu-chapters',
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
module.exports.listItemTap = listItemTap;
////module.exports.swipe = function(args) { navigation.swipe(args, curPageName, ['search', 'menu']); };
