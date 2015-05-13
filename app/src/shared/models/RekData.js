'use strict';

console.log('RUNNING REKDATA');

//let debug = require('./../utils/debug');

import {inspect, saveFile} from './../utils/debug';
import {Observable} from 'data/observable'

//var observableModule = require('data/observable');
//var observableArray = require('data/observable-array');


let masterData = [];
const typeNames = ['drugs', 'advice'];

var dataMainMenu = new Observable();
dataMainMenu.set('data', []);
dataMainMenu.on(Observable.propertyChangeEvent, function(propertyChangeData) {
	if (propertyChangeData.propertyName === 'selectedIndex') {
		let typeName = typeNames[dataMainMenu.get('selectedIndex')];
		let filteredData = masterData.filter(e => (e[typeName] === true));
		dataMainMenu.set('data', filteredData);
	}
});


let dataSubmenu = new Observable();

dataSubmenu.set('data', {});
dataSubmenu.on(Observable.propertyChangeEvent, function(propertyChangeData) {
	console.log(propertyChangeData.propertyName + " has been changed and the new value is: " + propertyChangeData.value);

	if (propertyChangeData.propertyName === 'selectedIndex') {
		let pathId = dataSubmenu.get('pathId');
		let filteredData = masterData.filter(item => (item.id === pathId));
		filteredData = filteredData[0]; // todo, check that we got exactly one
		let typeName = typeNames[dataSubmenu.get('selectedIndex')];
		let filteredOnTypes = filteredData.chapters.filter(chap => chap[typeName] === true);
		dataSubmenu.set('data', filteredOnTypes);
	}
});


/**
 * Get all dataMainMenu items
 *
 * @returns {*[]} Observable
 */
function getMainMenu() {
	return dataMainMenu;
}








/**
 * Clear and set dataMainMenu
 *
 * @param {Object[]} data
 */

function setMasterData(data) {

	while (masterData.length > 0) {
		masterData.pop();
	}
	data.forEach(function (entry) {
		masterData.push(entry);
	});

	dataMainMenu.set('selectedIndex', 0);

	saveFile('masterdata.json', JSON.stringify(data));
//	setDataToCurrentType();

}


function getSubmenu(pathId, selectedIndex) {
	dataSubmenu.set('pathId', pathId);

	if (dataSubmenu.get('selectedIndex') === selectedIndex) {
		dataSubmenu.notify({
			eventName: Observable.propertyChangeEvent,
			object: dataSubmenu,
			propertyName: 'selectedIndex',
			value: selectedIndex
		});
	} else {
		dataSubmenu.set('selectedIndex', selectedIndex);
	}
	return dataSubmenu;
}



module.exports.getMainMenu = getMainMenu;
module.exports.setMasterData = setMasterData;
module.exports.getSubmenu = getSubmenu;




/**
 * Model, data example:
 *
 * [
 * 		{
 * 			name: 'Diabetes',
 *	 		chapters: [
 * 				{
 * 					name: 'Insuliner',
 * 					id: 'diabetes/insuliner',
 * 					drugs: true
 * 				},
 * 				{
 * 					name: 'Riktvärden och omvandlingstabell',
 * 					id: 'diabetes/rikt..',
 * 					advice: true
 * 				},
 * 				{
 * 					name: 'Obesitas',
 * 					id: 'diabetes/obesitas',
 * 					advice: true,
 * 					drugs: true
 * 				},
 * 			]
 * 		}
 * ]
 */
