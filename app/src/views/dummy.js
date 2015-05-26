'use strict';

import customUi from './../shared/modules/ui';
import {inspect} from './../shared/utils/debug';
import ActionBar from './../shared/viewmodel/ActionBar';
const frameModule = require('ui/frame');

let page;
let actionBar;

function navigatingTo(args) {
	customUi.setViewDefaults();
	page = args.object;
	actionBar = new ActionBar('Den här sidan', 'Förra sidan', 0);
	let elActionbar = page.getViewById('actionbar');
	let elPagecontent = page.getViewById('pagecontent');
	elActionbar.bindingContext = actionBar;
	elPagecontent.bindingContext = {
		apa: 'boll'
	};
}

module.exports.navigatingTo = navigatingTo;
module.exports.drugsTap = function drugsTap() { actionBar.selectedIndex = 0; };
module.exports.adviceTap = function adviceTap() { actionBar.selectedIndex = 1; };
module.exports.backTap = function backTap() {
	let topmost = frameModule.topmost();
	topmost.goBack();
};

