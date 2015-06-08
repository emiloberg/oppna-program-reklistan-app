'use strict';

import {inspect} from './../shared/utils/debug';
var frameModule = require('ui/frame');
//var labelModule = require('ui/label');
//var pageModule = require('ui/page');

var initApp = require('./../shared/utils/appInit');
import customUi from './../shared/modules/ui';
import navigation from './../shared/utils/navigation';

var pageLoaded = function(args) {
	customUi.setViewDefaults();

	var page = args.object;
	page.bindingContext = {
		showRekMenu: 'REK-listan'
	};


	//frameModule.topmost().navigate('views/dummy4');
	initApp.init()
	.then(function () {
//		navigation.navigateToUrl('advice/Diabetes/Diabetes_typ_2_behandlingsalgoritm_for_VGR', 'Previous page');
//		navigation.navigateToUrl('advice/Alkohol_och_Tobak/Avvanjningsstod_for_tobak', 'Previous page');
		frameModule.topmost().navigate('views/menu-sections');
//		frameModule.topmost().navigate('views/search');
//		frameModule.topmost().navigate('views/dummy3');
//		frameModule.topmost().navigate('views/dummy4');

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

