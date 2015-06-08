'use strict';

import DataLoader from './DataLoader';
import {appViewModel} from '../viewmodel/RekAppViewModel';
import search from '../viewmodel/Search';
import {inspect, saveFile} from './debug';

function init() {

	return DataLoader.loadViewModelFromServer([
		{
			name: 'drugs',
			//url: 'http://192.168.56.1:5656/drugs.json'
			url: global.REK.urls.drugs
		}, {
			name: 'advice',
			//url: 'http://192.168.56.1:5656/advice.json'
			url: global.REK.urls.advice
		}
	], [
		{
			name: 'drugs',
			//url: 'http://192.168.56.1:5656/details-drugs.hbs'
			url: global.REK.urls.hbsDrugs
		}, {
			name: 'advice',
			//url: 'http://192.168.56.1:5656/details-advice.hbs'
			url: global.REK.urls.hbsAdvice
		}
	], [
		{
			name: 'custom',
			//url: 'http://192.168.56.1:5656/custom.css'
			url: global.REK.urls.css
		}
	])
	.then(list => {
		appViewModel.setMainDataList(list);
		search.addToIndex(list);
	});
}

module.exports.init = init;

