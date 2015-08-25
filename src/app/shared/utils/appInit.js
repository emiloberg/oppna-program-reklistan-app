'use strict';

import DataLoader from './DataLoader';
import {appViewModel} from '../viewmodel/RekAppViewModel';
import search from '../viewmodel/Search';
import {debug} from './debug';

function init(forceDownloadStr = '') {

	let forceDownload = (forceDownloadStr === 'force');

	debug('#### INITIALIZING APP ####');
	debug('Forcing download: ' + forceDownload);

	const sourceSpec = {
		forceDownload: forceDownload,
		supportJson: [{
			name: 'resources',
			localFileName: 'resources.json',
			url: global.REK.urls.resources,
			download: forceDownload
		}],

		json: [{
			name: 'drugs',
			localFileName: 'drugs.json',
			url: global.REK.urls.drugs,
			download: forceDownload
		}, {
			name: 'advice',
			localFileName: 'advice.json',
			url: global.REK.urls.advice,
			download: forceDownload
		}],

		templates: [{
			name: 'drugs',
			localFileName: 'details-drugs.hbs',
			url: global.REK.urls.hbsDrugs,
			download: forceDownload
		}, {
			name: 'advice',
			localFileName: 'details-advice.hbs',
			url: global.REK.urls.hbsAdvice,
			download: forceDownload
		}],

		css: [{
			name: 'custom',
			localFileName: 'custom.css',
			url: global.REK.urls.css,
			download: forceDownload
		}]
	};


	return DataLoader.loadViewModel(sourceSpec)
	.then(list => {
		appViewModel.setMainDataList(list);
		search.addToIndex(list);
	});
}

module.exports.init = init;

