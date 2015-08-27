'use strict';

let appViewModel = require('./../shared/viewmodel/RekAppViewModel');
import customUi from './../shared/modules/ui';
import language from './../shared/utils/language';
import ActionBar from './../shared/viewmodel/ActionBar';
import Mainmenu from './../shared/viewmodel/Mainmenu';
import AppMessage from './../shared/viewmodel/AppMessage';
import navigation from './../shared/utils/navigation';
const frameModule = require('ui/frame');

let page;
let actionBar;
let dataList;
let curPageName = language.appTitle;

function loaded(args) {
	customUi.setViewDefaults();
	page = args.object;

	actionBar = new ActionBar({
		pageTitle: curPageName,
		selectedIndex: page.navigationContext ? page.navigationContext.selectedIndex : undefined
	});
	let elActionBar = page.getViewById('actionbar');
	elActionBar.bindingContext = actionBar;

	let elPageContent = page.getViewById('pagecontent');
	dataList = appViewModel.appViewModel.getMainDataList();
	dataList.set('selectedIndex', actionBar.get('selectedIndex'));
	elPageContent.bindingContext = dataList;

	const elMenu = page.getViewById('menuwrapper');
	elMenu.bindingContext = Mainmenu.setup(page.getViewById('maincontent'), elMenu);

	const elAppMessage = page.getViewById('appmessage');
	elAppMessage.bindingContext = AppMessage.setup(elAppMessage);
}

function menuItemTap(args) {
    var section = args.view.bindingContext;
    frameModule.topmost().navigate({
        moduleName: 'views/menu-chapters',
        context: {
			data: section,
			//selectedIndex: dataList.selectedIndex,
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
module.exports.swipe = function(args) {
	navigation.swipe(args, curPageName, ['search', 'menu']);
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
