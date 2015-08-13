'use strict';

import {inspect} from './../shared/utils/debug';
var frameModule = require('ui/frame');
var initApp = require('./../shared/utils/appInit');
import customUi from './../shared/modules/ui';
import navigation from './../shared/utils/navigation';
import {Observable} from 'data/observable';
import language from './../shared/utils/language';
var contextObj = new Observable({
	rek: language.splashREK,
	listan: language.splashListan
});

var pageLoaded = function(args) {
	customUi.setViewDefaults();

	var page = args.object;
	page.bindingContext = contextObj;

	contextObj.set('loadingCount', 0);

	let loadingInterval = setInterval(function () {
		let curLoadingCount = contextObj.get('loadingCount') > 5 ? 0 : contextObj.get('loadingCount') + 1 ;
		contextObj.set('loadingCount', curLoadingCount);
	}, 200);

	initApp.init()
	.then(function () {
		clearInterval(loadingInterval);
		contextObj.set('loadingCount', 0);
//		navigation.navigateToUrl('advice/Diabetes/Diabetes_typ_2_behandlingsalgoritm_for_VGR', 'Previous page');
//		navigation.navigateToUrl('advice/Alkohol_och_Tobak/Avvanjningsstod_for_tobak', 'Previous page');
		frameModule.topmost().navigate('views/menu-sections');
// 		frameModule.topmost().navigate('views/search');
//		frameModule.topmost().navigate('views/dummy3');
//		frameModule.topmost().navigate('views/dummy4');
//		frameModule.topmost().navigate('views/dummy4');
	})
	.catch(function (e) {
		clearInterval(loadingInterval);
		console.dir(e.message);
		console.log('ERROR');
		contextObj.set('error', e.message);
	});

};



exports.pageLoaded = pageLoaded;

