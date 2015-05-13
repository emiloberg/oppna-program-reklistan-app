let RekData = require('./../shared/models/RekData');

let customUiModule = require('./../shared/modules/ui');

import {inspect} from './../shared/utils/debug';

function pageLoaded(args) {
	const page = args.object;
	console.log('Chapters Page Loaded');
	page.bindingContext = RekData.getSubmenu();	
}

function pageNavigatedTo(args) {
	const page = args.object;

	RekData.updateSubmenu(args.context.pathId, args.context.selectedIndex);
	//customUiModule.topbar.setText(page, context.name);
}


module.exports.pageLoaded = pageLoaded;
module.exports.pageNavigatedTo = pageNavigatedTo;
