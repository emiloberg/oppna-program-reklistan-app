'use strict';

import DataLoader from '../../alt/util/DataLoader';
import {appViewModel} from '../../alt/viewmodel/RekAppViewModel';
import {inspect, saveFile} from './debug';

function init() {
	return DataLoader.loadViewModelFromServer([
		{	
			name: 'drugs',
			url: 'http://localhost:5656/drugs.json'
		},{
			name: 'advice',
			url: 'http://localhost:5656/advice.json'
		}
	],[
		{	
			name: 'drugs',
			url: 'http://localhost:5656/details-drugs.hbs'
		},{
			name: 'advice',
			url: 'http://localhost:5656/details-advice.hbs'
		}
	],[
		{
			name: 'custom',
			url: 'http://localhost:5656/custom.css'
		}
	])
	.then(list => {

		appViewModel.setMainDataList(list);
	})
}

module.exports.init = init;
