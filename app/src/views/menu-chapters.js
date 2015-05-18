let RekData = require('./../shared/models/RekData');
let debug = require('./../shared/utils/debug');
let customUiModule = require('./../shared/modules/ui');

import {inspect} from './../shared/utils/debug';

function pageLoaded(args) {
//	const page = args.object;
//	console.log('Chapters Page Loaded');
//	page.bindingContext = RekData.getSubmenu();	
}

function pageNavigatedTo(args) {
	var page = args.object;
    page.bindingContext = page.navigationContext;
}


module.exports.pageLoaded = pageLoaded;
module.exports.pageNavigatedTo = pageNavigatedTo;
