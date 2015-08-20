'use strict';

var frameModule = require('ui/frame');
var initApp = require('./../shared/utils/appInit');
import customUi from './../shared/modules/ui';
import {Observable} from 'data/observable';
import language from './../shared/utils/language';
import * as debug from './../shared/utils/debug';
import * as dialog from 'ui/dialogs';
var contextObj = new Observable({
	rek: language.splashREK,
	listan: language.splashListan
});

var pageLoaded = function(args) {
	customUi.setViewDefaults();

	debug.debug('User initialized reload of data');

	var connectivity = require("connectivity");
	var connectionType = connectivity.getConnectionType();
	console.log('CONNECTION:');
	console.dir(connectionType);

	var page = args.object;
	page.bindingContext = contextObj;

	contextObj.set('loadingCount', 0);

	let loadingInterval = setInterval(function () {
		let curLoadingCount = contextObj.get('loadingCount') > 5 ? 0 : contextObj.get('loadingCount') + 1 ;
		contextObj.set('loadingCount', curLoadingCount);
	}, 200);


	debug.removeLocalFiles()
	.then(function() {
		return initApp.init('force');
	})
	.then(function () {
		debug.debug('All done. Manual refresh of data successful!');
		clearInterval(loadingInterval);
		contextObj.set('loadingCount', 0);
		frameModule.topmost().goBack();
	})
	.catch(function (e) {
		clearInterval(loadingInterval);
		contextObj.set('loadingCount', 0);
		console.dir(e.message);
		console.log('ERROR');
		contextObj.set('error', e.message);
			//todo fix so that user can go back
	});

};

exports.pageLoaded = pageLoaded;
