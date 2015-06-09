'use strict';

import DataLoader from './DataLoader';
import {appViewModel} from '../viewmodel/RekAppViewModel';
import search from '../viewmodel/Search';
import {inspect, saveFile, debug} from './debug';

function init() {

	debug('INITIALIZING APP');

	return DataLoader.loadViewModelFromServer([
		{
			name: 'drugs',
			develName: 'drugs.json',
			url: global.REK.urls.drugs
		}, {
			name: 'advice',
			develName: 'advice.json',
			url: global.REK.urls.advice
		}
	], [
		{
			name: 'drugs',
			develName: 'details-drugs.hbs',
			url: global.REK.urls.hbsDrugs
		}, {
			name: 'advice',
			develName: 'details-advice.hbs',
			url: global.REK.urls.hbsAdvice
		}
	], [
		{
			name: 'custom',
			develName: 'custom.css',
			url: global.REK.urls.css
		}
	])
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

