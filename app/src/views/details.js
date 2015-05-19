let RekData = require('./../shared/models/RekData');
import {inspect, saveFile} from './../shared/utils/debug';
let customUiModule = require('./../shared/modules/ui');
var application = require('application');


let page;

function loaded(args) {
}

function navigatedTo(args) {
	page = args.object;
	let context = page.navigationContext;
	//inspect(context.selectedIndex);
	//inspect(context.item.title);
	//inspect(context.item.hasType('drugs'));
	//inspect(context.item.hasType('advice'));
	//inspect(context.item.getContent(context.selectedIndex));

	var webView = page.getViewById("detailsWV");
	webView.src = context.item.getContent(context.selectedIndex);
}

//
//let tappedBindingContext = args.view.bindingContext;
//let html = tappedBindingContext.getContent(page.bindingContext.selectedIndex);


module.exports.loaded = loaded;
module.exports.navigatedTo = navigatedTo;

