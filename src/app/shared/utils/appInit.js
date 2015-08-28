'use strict';

import DataLoader from './DataLoader';
import {appViewModel} from '../viewmodel/RekAppViewModel';
import search from '../viewmodel/Search';
import {debug} from './debug';

function init(forceDownloadStr = '') {
	let forceDownload = (forceDownloadStr === 'force');

	debug('#### INITIALIZING APP ####');
	debug('Forcing download: ' + forceDownload);

	return DataLoader.getDataLocation(forceDownload)
	.then(DataLoader.loadViewModel)
	.then(list => {
		appViewModel.setMainDataList(list);
		search.addToIndex(list);
	});
}

module.exports.init = init;
