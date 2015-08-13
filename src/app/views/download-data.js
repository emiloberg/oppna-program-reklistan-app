'use strict';

var frameModule = require('ui/frame');
var initApp = require('./../shared/utils/appInit');
import customUi from './../shared/modules/ui';
import {Observable} from 'data/observable';
import language from './../shared/utils/language';
import * as debug from './../shared/utils/debug';
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


	debug.removeLocalFiles()
	.then(initApp.init)
	.then(function () {
		debug.debug('All done. Success downloading data');
		clearInterval(loadingInterval);
		contextObj.set('loadingCount', 0);
		//frameModule.topmost().navigate('views/menu-sections');
	})
	.catch(function (e) {
		clearInterval(loadingInterval);
		contextObj.set('loadingCount', 0);
		console.dir(e.message);
		console.log('ERROR');
		contextObj.set('error', e.message);
	});

};


exports.pageLoaded = pageLoaded;
