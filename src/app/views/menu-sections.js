'use strict';

import {inspect} from './../shared/utils/debug';

let appViewModel = require('./../shared/viewmodel/RekAppViewModel');
import customUi from './../shared/modules/ui';
import language from './../shared/utils/language';
import ActionBar from './../shared/viewmodel/ActionBar';
import Mainmenu from './../shared/viewmodel/Mainmenu';
import navigation from './../shared/utils/navigation';
const frameModule = require('ui/frame');

let page;
let actionBar;
let dataList;
let curPageName = language.appTitle;


function navigatingTo(args) {
	customUi.setViewDefaults();
	page = args.object;

	actionBar = new ActionBar(curPageName, 'Förra sidan', 0);
	let elActionBar = page.getViewById('actionbar');
	elActionBar.bindingContext = actionBar;

	let elPageContent = page.getViewById('pagecontent');
	dataList = appViewModel.appViewModel.getMainDataList();
	elPageContent.bindingContext = dataList;
}

function loaded(args) {
	const elMenu = page.getViewById('menuwrapper');
	elMenu.bindingContext = Mainmenu.setup(page.getViewById('maincontent'), elMenu);
}

function menuItemTap(args) {
    var section = args.view.bindingContext;
    frameModule.topmost().navigate({
        moduleName: 'views/menu-chapters',
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


module.exports.loaded = loaded;
module.exports.navigatingTo = navigatingTo;
module.exports.drugsTap = drugsTap;
module.exports.adviceTap = adviceTap;
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