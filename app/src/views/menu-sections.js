var RekData = require('./../shared/models/RekData');
var frameModule = require('ui/frame');
let debug = require('./../shared/utils/debug');
let uiModule = require('./../shared/modules/ui');

function pageNavigatedTo(args) {
	var page = args.object;
	uiModule.topbar.setText(page, 'Toppen');
	page.bindingContext = RekData.get();
}

function menuItemTap(args) {
	console.log('tapped');
	//debug.inspect(args.view.bindingContext.id);
	//frameModule.topmost().navigate('views/menu-sections');


	let topmost = frameModule.topmost();
	let navigationEntry = {
		moduleName: 'views/menu-chapters',
		context: {
			pathId: args.view.bindingContext.id
		}
	};
	topmost.navigate(navigationEntry);


}

function typeTap(args) {
	console.log('TAP');
		debug.inspect(args.view.bindingContext);

}

exports.pageNavigatedTo = pageNavigatedTo;
exports.menuItemTap = menuItemTap;
exports.typeTap = typeTap;


