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

let enterDebugTapCounter = 0;
let enterDebugLastTap = 0;
const DEBUG_MODE_MAX_MS = 2000;
const DEBUG_MODE_TAPS = 5;
function develTap() {
	const curTime = new Date().getTime();
	if ((curTime - enterDebugLastTap) > DEBUG_MODE_MAX_MS) {
		enterDebugLastTap = curTime;
		enterDebugTapCounter = 1;
	} else {
		enterDebugTapCounter += 1;
	}

	if (enterDebugTapCounter > DEBUG_MODE_TAPS) {
		frameModule.topmost().navigate({
			moduleName: 'views/developer',
			context: {
				prevPageTitle: ''
			}
		});
	}
}

exports.pageLoaded = pageLoaded;
exports.errorTryAgain = loadData;
module.exports.develTap = develTap;
