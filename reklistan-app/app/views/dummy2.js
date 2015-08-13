/**
 * Created by emiloberg on 15-05-27.
 */
'use strict';

var _sharedUtilsDebug = require('./../shared/utils/debug');

var view = require('ui/core/view');
var page = undefined;

function navigatingTo(args) {
	page = args.object;

	var wv = page.getViewById('detailsWV');

	var html = '<!DOCTYPE html>\n\t\t<html lang="en">\n\t\t<head>\n\t\t\t<meta charset="utf-8">\n\t\t\t<title>REKListan</title>\n\t\t\t<style>\n\t\t\t</style>\n\t\t</head>\n\t\t<body>\n\t\t\t<h1>HEJ!</h1>\n\t\t</body>\n\t\t</html>';

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