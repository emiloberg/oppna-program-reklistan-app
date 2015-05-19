'use strict';

let RekData = require('./../shared/models/RekData');
import {inspect, saveFile} from './../shared/utils/debug';
let customUiModule = require('./../shared/modules/ui');
var application = require('application');
import {templatesModel} from './../shared/utils/htmlRenderer'


let page;

function loaded(args) {
}

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


	var webView = page.getViewById("detailsWV");
	webView.src = html;
}


module.exports.loaded = loaded;
module.exports.navigatedTo = navigatedTo;

