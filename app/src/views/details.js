'use strict';

import {inspect} from './../shared/utils/debug';
let customUiModule = require('./../shared/modules/ui');
//var application = require('application');
import {templatesModel} from './../shared/utils/htmlRenderer';
let webViewModule = require('ui/web-view');


let page;
//
//function loaded(args) {
//}

function navigatedTo(args) {
	page = args.object;
	let context = page.navigationContext;

	customUiModule.topbar.setText(page, context.item.title);

	//inspect(context.selectedIndex);
	//inspect(context.item.title);
	//inspect(context.item.hasType('drugs'));
	//inspect(context.item.hasType('advice'));
	//inspect(context.item.getContent(context.selectedIndex));

	let html = `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="utf-8">
			<title>REKListan</title>
			<style>
			${templatesModel.getCss('custom')}
			</style>
		</head>
		<body>
			${context.item.getContent(context.selectedIndex)}
		</body>
		</html>`;


	var webView = page.getViewById('detailsWV');
	webView.src = html;

	webView.on(webViewModule.WebView.loadStartedEvent, function(e) {
		inspect(e.url);
		//if (e.url.indexOf('tjohej://') > -1) {
		//	e.object.ios.stopLoading();
		//}

		//var topFrame = FrameModule.topmost();
		//topFrame.navigate({
		//	create: function() {
		//		var testPage2 = new PageModule.Page();
		//		var webView2 = new webViewModule.WebView();
		//		webView2.url = 'file:///tmp/hej.html';
		//		testPage2.content = webView2;
		//		return testPage2;
		//	}
		//});



		// Todo: Same for android
		//e.object.ios.stopLoading();

	});

}


//module.exports.loaded = loaded;
module.exports.navigatedTo = navigatedTo;

