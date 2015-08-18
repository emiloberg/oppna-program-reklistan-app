'use strict';

import DataLoader from './DataLoader';
import {appViewModel} from '../viewmodel/RekAppViewModel';
import search from '../viewmodel/Search';
import {inspect, saveFile, debug} from './debug';
//
//import fs from 'file-system';
//const DOCUMENTS_FOLDER = fs.knownFolders.documents();



//var file = documents.getFile("NewFileToCreate.txt");

function init(forceDownloadStr = '') {

	let forceDownload = (forceDownloadStr === 'force');

	debug('#### INITIALIZING APP ####');
	debug('Forcing download: ' + forceDownload);

	const sourceSpec = {
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
	//.catch(err => {
	//	console.log(err);
	//	console.log('FEL I INIT()');
	//});
}

module.exports.init = init;

