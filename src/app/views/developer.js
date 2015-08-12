'use strict';

import * as debug from './../shared/utils/debug';
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

	let elLog = page.getViewById('log');
	elLog.bindingContext = debug.getDebugLog();
}


module.exports.navigatingTo = navigatingTo;
module.exports.backTap = navigation.back;
module.exports.swipe = function(args) {
	navigation.swipe(args, '', ['back']);
};
module.exports.removeLocalFilesTap = debug.removeLocalFiles;
module.exports.removeLocalImagesTap = debug.removeLocalImages;
module.exports.removeLocalCacheTap = debug.removeLocalCache;
module.exports.clearDebugLogTap = debug.clearDebugLog;
