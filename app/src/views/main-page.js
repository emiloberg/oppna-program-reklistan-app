'use strict';

var frameModule = require('ui/frame');
//var labelModule = require('ui/label');
//var pageModule = require('ui/page');

var initApp = require('./../shared/utils/appInit');
import customUi from './../shared/modules/ui';

var pageLoaded = function(args) {
	customUi.setViewDefaults();

	var page = args.object;
	page.bindingContext = {
		showRekMenu: 'REK-listan'
	};

	//frameModule.topmost().navigate('views/dummy2');
	initApp.init()
	.then(function () {
//		frameModule.topmost().navigate('views/menu-sections');
		frameModule.topmost().navigate('views/dummy3');
	})
	.catch(function (e) {
		console.dir(e);
	});

};


exports.pageLoaded = pageLoaded;


function showRekMenu() {
	frameModule.topmost().navigate('views/menu-sections');
}
exports.showRekMenu = showRekMenu;




//var factoryFunc = function () {
//	var label = new labelModule.Label();
//	label.text = 'Hello, world!';
//	var page = new pageModule.Page();
//	page.content = label;
//	return page;
//};
//
