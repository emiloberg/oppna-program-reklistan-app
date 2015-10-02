'use strict';

import * as frameModule from 'ui/frame';
import * as initApp from './../shared/utils/appInit';
import customUi from './../shared/modules/ui';
import {Observable} from 'data/observable';
import language from './../shared/utils/language';
import {debug, inspect} from './../shared/utils/debug';
import Images from './../shared/utils/images';
var contextObj = new Observable({
	error: '',
	errorGoBack: '',
	errorTryAgain: '',
	rekLogo: Images.rekLogo,
	loadingCount: 0
});
var downloadType = 'manual';
var loadingInterval;

var pageLoaded = function(args) {
	customUi.setViewDefaults();

	var page = args.object;
	page.bindingContext = contextObj;


	if (page.navigationContext) {
		downloadType = page.navigationContext.downloadType === 'init' ? 'init' : 'manual';
	}

	debug(`Started ${downloadType} download of data`);


	var forceDownload = downloadType === 'manual' ? 'force' : '';
	loadData(forceDownload);
};

function loadData(forceDownload) {

	contextObj.set('loadingCount', 0);
	contextObj.set('error', '');
	contextObj.set('errorGoBack', '');
	contextObj.set('errorTryAgain', '');

	loadingInterval = setInterval(function () {
		let curLoadingCount = contextObj.get('loadingCount') > 5 ? 0 : contextObj.get('loadingCount') + 1;
		contextObj.set('loadingCount', curLoadingCount);
	}, 200);

	setTimeout(function() {
		runInit(forceDownload);
	}, 120);

}

function runInit(forceDownload) {
	initApp.init(forceDownload)
		.then(function () {
			debug(`All done, ${downloadType} refresh of data successful!`);
			clearInterval(loadingInterval);
			contextObj.set('loadingCount', 0);
			global.dataIsLoaded = true;
			frameModule.topmost().navigate({
				moduleName: 'views/menu-sections',
				context: {}
				//animated: false
			});
		})
		.catch(function (e) {
			debug('Could not ${downloadType} download data');
			debug(JSON.stringify(e));

			clearInterval(loadingInterval);
			contextObj.set('loadingCount', 0);

			let txtErrorNoNetwork = '';
			let txtErrorUnknown = '';
			let txtButtonGoBack = '';
			let txtButtonTryAgain = '';

			if (downloadType === 'manual') {
				txtErrorNoNetwork = language.downloadDataNoConnection;
				txtErrorUnknown = language.downloadDataUnknownError;
				txtButtonGoBack = language.downloadDataErrorGoBack;
			} else {
				txtErrorNoNetwork = language.downloadDataInitial;
				txtErrorUnknown = language.downloadDataInitial;
				txtButtonTryAgain = language.downloadDataTryAgain;
			}

			if (e === 'NO_NETWORK') {
				contextObj.set('error', txtErrorNoNetwork);
			} else {
				contextObj.set('error', txtErrorUnknown);
			}

			contextObj.set('errorGoBack', txtButtonGoBack);
			contextObj.set('errorTryAgain', txtButtonTryAgain);
		});
}

let enterDebugTapCounter = 0;
let enterDebugLastTap = 0;
const DEBUG_MODE_MAX_MS = 5000;
const DEBUG_MODE_TAPS = 3;
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
exports.develTap = develTap;
exports.errorTryAgain = loadData;
//exports.errorGoBack = frameModule.topmost().goBack;