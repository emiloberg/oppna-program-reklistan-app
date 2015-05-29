'use strict';

import DataLoader from './DataLoader';
import {appViewModel} from '../viewmodel/RekAppViewModel';
import {inspect, saveFile} from './debug';

function init() {
	return DataLoader.loadViewModelFromServer([
		{
			name: 'drugs',
			url: 'http://192.168.1.68:5656/drugs.json'
		}, {
			name: 'advice',
			url: 'http://192.168.1.68:5656/advice.json'
		}
	], [
		{
			name: 'drugs',
			url: 'http://192.168.1.68:5656/details-drugs.hbs'
		}, {
			name: 'advice',
			url: 'http://192.168.1.68:5656/details-advice.hbs'
		}
	], [
		{
			name: 'custom',
			url: 'http://192.168.1.68:5656/custom.css'
		}
	])
	.then(list => {
		appViewModel.setMainDataList(list);
		saveFile('nyRekDataList.json', JSON.stringify(list));
	});
}

module.exports.init = init;
