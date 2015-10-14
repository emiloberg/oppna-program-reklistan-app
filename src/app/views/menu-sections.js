'use strict';

import {appViewModel} from './../shared/viewmodel/RekAppViewModel';
import customUi from './../shared/modules/ui';
import language from './../shared/utils/language';
import {time, timeEnd, timePeek, inspect} from './../shared/utils/debug';
import ActionBar from './../shared/viewmodel/ActionBar';
import Mainmenu from './../shared/viewmodel/Mainmenu';
import AppMessage from './../shared/viewmodel/AppMessage';
import * as frameModule from 'ui/frame';
import screenDimensions from './../shared/utils/screenDimensions'

import {AbsoluteLayout} from 'ui/layouts/absolute-layout';

let page;
let actionBar;
let dataList;
let curPageName = language.appTitle;

function loaded(args) {
	//if (!page) {
		init(args);
	//}
}

function init(args) {
	customUi.setViewDefaults();
	page = args.object;

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

	// Action bar
	actionBar = new ActionBar({
		pageTitle: curPageName,
		selectedIndex: page.navigationContext ? page.navigationContext.selectedIndex : undefined
	});
	actionBar.drugsTap = function() { switchTab(0); };
	actionBar.adviceTap = function() { switchTab(1); };
	elActionBar.bindingContext = actionBar;

	// listView list
	dataList = appViewModel.getMainDataList();
	dataList.set('selectedIndex', actionBar.get('selectedIndex'));
	elPageContent.bindingContext = dataList;

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
module.exports.menuItemTap = menuItemTap;
////module.exports.swipe = function(args) { navigation.swipe(args, curPageName, ['search', 'menu']); };
