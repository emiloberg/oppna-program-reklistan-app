let RekData = require('./../shared/models/RekData');

let customUiModule = require('./../shared/modules/ui');

import {inspect} from './../shared/utils/debug';

function pageNavigatedTo(args) {
	let page = args.object;

	let apa = RekData.getSubmenu(args.context.pathId, args.context.selectedIndex);

	page.bindingContext = apa;

	//inspect(page.bindingContext);

	//debug.inspect(args.context.pathId);
	//debug.inspect(context);


	//customUiModule.topbar.setText(page, context.name);
}


module.exports.pageNavigatedTo = pageNavigatedTo;
