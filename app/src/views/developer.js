'use strict';

import {getDebugLog} from './../shared/utils/debug';
import customUi from './../shared/modules/ui';
import ActionBar from './../shared/viewmodel/ActionBar';
import navigation from './../shared/utils/navigation';


function navigatingTo(args) {
	customUi.setViewDefaults();
	let page = args.object;
	let navContext = page.navigationContext;

	let actionBar = new ActionBar('', navContext.prevPageTitle, 0);
	let elActionBar = page.getViewById('actionbar');
	elActionBar.bindingContext = actionBar;

	let elPageContent = page.getViewById('pagecontent');
	elPageContent.bindingContext = getDebugLog();
}


module.exports.navigatingTo = navigatingTo;
module.exports.backTap = navigation.back;
module.exports.swipe = function(args) {
	navigation.swipe(args, '', ['back']);
};
