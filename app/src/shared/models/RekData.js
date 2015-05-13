'use strict';

import {inspect, saveFile} from './../utils/debug';
import {Observable} from 'data/observable'

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
	console.log('main menu property updated: ' + propertyChangeData.propertyName);
});


let dataSubmenu = new Observable();

dataSubmenu.set('data', {});
//dataSubmenu.on(Observable.propertyChangeEvent, function(propertyChangeData) {
//	console.log(propertyChangeData.propertyName + " has been changed and the new value is: " + propertyChangeData.value);
//});

/**
 * Get all dataMainMenu items
 *
 * @returns {*[]} Observable
 */
function getMainMenu() {
	return dataMainMenu;
}

/**
 * Get all submenu items
 *
 * @returns {*[]} Observable
 */
function getSubmenu() {
	return dataSubmenu;
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

function updateSubmenu(pathId, selectedIndex) {
	
	let filteredData = masterData.filter(item => (item.id === pathId));
	
	filteredData = filteredData[0]; // todo, check that we got exactly one

	const typeName = typeNames[selectedIndex];
	console.log(typeName);
	const filteredOnTypes = filteredData.chapters.filter(chap => chap[typeName] === true);
	inspect(filteredOnTypes);
	dataSubmenu.set('data', filteredOnTypes);
}

module.exports.getMainMenu = getMainMenu;
module.exports.getSubmenu = getSubmenu;
module.exports.setMasterData = setMasterData;
module.exports.updateSubmenu = updateSubmenu;




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
