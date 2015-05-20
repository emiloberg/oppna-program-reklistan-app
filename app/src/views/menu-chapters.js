import {inspect, saveFile} from './../shared/utils/debug';
let customUiModule = require('./../shared/modules/ui');
var frameModule = require('ui/frame');

let page;

function pageLoaded(args) {

}

function pageNavigatedTo(args) {
	page = args.object;
	customUiModule.topbar.setText(page, page.navigationContext.title);
	page.bindingContext = page.navigationContext;
}


function menuItemTap(args) {
	frameModule.topmost().navigate({
		moduleName: "views/details",
		context: {
			item: args.view.bindingContext,
			selectedIndex: page.bindingContext.selectedIndex
		}
	});
}


module.exports.pageLoaded = pageLoaded;
module.exports.pageNavigatedTo = pageNavigatedTo;
module.exports.menuItemTap = menuItemTap;
