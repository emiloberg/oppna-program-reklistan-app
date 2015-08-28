'use strict';

import * as frameModule from 'ui/frame';
import * as initApp from './../shared/utils/appInit';
import customUi from './../shared/modules/ui';
import {Observable} from 'data/observable';
import language from './../shared/utils/language';
import {debug} from './../shared/utils/debug';

let contextObj = new Observable({
	rek: language.splashREK,
	listan: language.splashListan
});

const pageLoaded = function(args) {
	customUi.setViewDefaults();
	let page = args.object;
	page.bindingContext = contextObj;
	loadData();
};

function loadData() {
	contextObj.set('loadingCount', 0);
	contextObj.set('error', '');
	contextObj.set('errorTryAgain', '');

	let loadingInterval = setInterval(function () {
		let curLoadingCount = contextObj.get('loadingCount') > 5 ? 0 : contextObj.get('loadingCount') + 1;
		contextObj.set('loadingCount', curLoadingCount);
	}, 200);

	initApp.init()
	.then(function () {
		clearInterval(loadingInterval);
		contextObj.set('loadingCount', 0);
		frameModule.topmost().navigate('views/menu-sections');
	})
	.catch(function (e) {
		debug('Could not load data during initial load');
		debug(JSON.stringify(e));

		clearInterval(loadingInterval);
		contextObj.set('loadingCount', 0);

		if (e === 'NO_NETWORK') {
			contextObj.set('error', language.downloadDataInitial);
		} else {
			contextObj.set('error', language.downloadDataInitial);
		}

		contextObj.set('errorTryAgain', language.downloadDataTryAgain);
	});
}

exports.pageLoaded = pageLoaded;
exports.errorTryAgain = loadData;
