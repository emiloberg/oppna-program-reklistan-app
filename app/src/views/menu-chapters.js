let RekData = require('./../shared/models/RekData');
let debug = require('./../shared/utils/debug');
let customUiModule = require('./../shared/modules/ui');

function pageNavigatedTo(args) {
	let page = args.object;
	let context = RekData.getFromPathId(args.context.pathId);
	debug.inspect(args.context.pathId);
	page.bindingContext = context;
	//customUiModule.topbar.setText(page, context.name);
}


module.exports.pageNavigatedTo = pageNavigatedTo;
