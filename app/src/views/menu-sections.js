'use strict';

import {inspect} from './../shared/utils/debug';

let appViewModel = require('./../shared/viewmodel/RekAppViewModel');
import customUi from './../shared/modules/ui';
import language from './../shared/utils/language';
import ActionBar from './../shared/viewmodel/ActionBar';
const frameModule = require('ui/frame');

let page;
let actionBar;
let dataList;

function navigatingTo(args) {
	customUi.setViewDefaults();
	page = args.object;

	actionBar = new ActionBar(language.appTitle, 'Förra sidan', 0);
	let elActionBar = page.getViewById('actionbar');
	elActionBar.bindingContext = actionBar;

	let elPageContent = page.getViewById('pagecontent');
	dataList = appViewModel.appViewModel.getMainDataList();
	elPageContent.bindingContext = dataList;
}

function menuItemTap(args) {
    var section = args.view.bindingContext;
    frameModule.topmost().navigate({
        moduleName: 'views/menu-chapters',
        context: {
			data: section,
			selectedIndex: dataList.selectedIndex,
			prevPageTitle: language.appTitle
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

