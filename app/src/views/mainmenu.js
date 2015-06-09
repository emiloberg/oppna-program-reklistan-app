'use strict';

import {inspect} from './../shared/utils/debug';

import {templatesModel} from './../shared/utils/htmlRenderer';
import customUi from './../shared/modules/ui';
import ActionBar from './../shared/viewmodel/ActionBar';
import navigation from './../shared/utils/navigation';
import {android, ios} from 'application';

//const frameModule = require('ui/frame');

function navigatingTo(args) {
	customUi.setViewDefaults();
	let page = args.object;
	let navContext = page.navigationContext;

	let actionBar = new ActionBar('', navContext.prevPageTitle, 0);
	let elActionBar = page.getViewById('actionbar');
	elActionBar.bindingContext = actionBar;

	inspect('Navigating to main menu');

}


module.exports.navigatingTo = navigatingTo;
module.exports.backTap = navigation.back;
module.exports.swipe = function(args) {
	navigation.swipe(args, '', ['back']);
};
