/**
 * Created by emiloberg on 15-05-27.
 */
import {inspect} from './../shared/utils/debug';
var view = require('ui/core/view');
let page;

function navigatingTo(args) {
	page = args.object;

	var wv = page.getViewById('detailsWV');

	let html = `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="utf-8">
			<title>REKListan</title>
			<style>
			</style>
		</head>
		<body>
			<h1>HEJ!</h1>
		</body>
		</html>`;

	wv.src = html;
}

function vwLoaded(args) {
	//let apa = args.object;
	//inspect(apa);
	//console.log('WEB VIEW LOADED');
	//
	//
	//let wv = apa.getViewById('detailsWV');
	//
	//let html = `<!DOCTYPE html>
	//	<html lang="en">
	//	<head>
	//		<meta charset="utf-8">
	//		<title>REKListan</title>
	//		<style>
	//		</style>
	//	</head>
	//	<body>
	//		<h1>HEJ!</h1>
	//	</body>
	//	</html>`;
	//
	//wv.src = html;

}

module.exports.navigatingTo = navigatingTo;
module.exports.vwLoaded = vwLoaded;
