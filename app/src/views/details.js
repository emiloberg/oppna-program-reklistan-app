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
	inspect(context.selectedIndex);
	inspect(context.item.title);
	inspect(context.item.hasType('drugs'));
	inspect(context.item.hasType('advice'));
	inspect(context.item.getContent(context.selectedIndex));


	var webView = page.getViewById('detailsWV');
	var html = '<html><body><h1>I can haz webview?</h1></body><html>';

	if (application.ios) {
		webView.ios.loadHTMLStringBaseURL(html, null);
	} else if (application.android) {
		webview.android.loadData(html, 'text/html', null);
	}

}

//
//let tappedBindingContext = args.view.bindingContext;
//let html = tappedBindingContext.getContent(page.bindingContext.selectedIndex);


module.exports.loaded = loaded;
module.exports.navigatedTo = navigatedTo;
