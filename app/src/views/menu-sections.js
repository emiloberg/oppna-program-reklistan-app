var RekData = require('./../shared/models/RekData');
var frameModule = require('ui/frame');
let debug = require('./../shared/utils/debug');
let uiModule = require('./../shared/modules/ui');

function pageLoaded(args) {
	var page = args.object;
	page.bindingContext = RekData.getMainMenu();
}

function pageNavigatedTo(args) {
	var page = args.object;
	uiModule.topbar.setText(page, 'Startmeny');
}

function menuItemTap(args) {

	let page = args.object;
	let topmost = frameModule.topmost();
	let navigationEntry = {
		moduleName: 'views/menu-chapters',
		context: {
			pathId: args.view.bindingContext.id,
			selectedIndex: page.bindingContext.selectedIndex
		}
	};
	topmost.navigate(navigationEntry);
}


exports.menuItemTap = menuItemTap;
exports.pageLoaded = pageLoaded;
exports.pageNavigatedTo = pageNavigatedTo;

