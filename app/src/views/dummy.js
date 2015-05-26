'use strict';

import customUi from './../shared/modules/ui';
import {inspect} from './../shared/utils/debug';
import ActionBar from './../shared/viewmodel/ActionBar';

let page;
let actionBar;

function loaded() {
}

function navigatedTo(args) {
	customUi.setViewDefaults();
	page = args.object;
	actionBar = new ActionBar('Den här sidan', 'Förra sidan', 0);
	page.bindingContext = actionBar;
}


module.exports.loaded = loaded;
module.exports.navigatedTo = navigatedTo;
module.exports.drugsTap = function drugsTap() { actionBar.selectedIndex = 0; };
module.exports.adviceTap = function adviceTap() { actionBar.selectedIndex = 1; };
