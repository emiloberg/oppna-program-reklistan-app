'use strict';

let debug = require('./../utils/debug');
var observableModule = require('data/observable');
var observableArray = require('data/observable-array');



let selectedIndex = 1;
let masterData = [];

var dataMainMenu = new observableModule.Observable();
dataMainMenu.set('data', []);
dataMainMenu.set('selectedIndex', selectedIndex);
dataMainMenu.on(observableModule.Observable.propertyChangeEvent, function(propertyChangeData) {
	console.log('HEJ');
	console.log(propertyChangeData.propertyName + " has been changed and the new value is: " + propertyChangeData.value);
	if (propertyChangeData.propertyName === 'selectedIndex') {
		selectedIndex  = propertyChangeData.value;
		let filteredData = masterData.filter(e => (e[typeName] === true));
		dataMainMenu.set('data', filteredData);
	}
});


let dataSubmenu = new observableModule.Observable();
dataSubmenu.set('data', []);
dataSubmenu.set('selectedIndex', selectedIndex);
dataSubmenu.on(observableModule.Observable.propertyChangeEvent, function(propertyChangeData) {
	console.log(propertyChangeData.propertyName + " has been changed and the new value is: " + propertyChangeData.value);
	if (propertyChangeData.propertyName === 'selectedIndex') {
		selectedIndex  = propertyChangeData.value;
//		setDataToCurrentType();
	}
});

/**
 * Get all dataMainMenu items
 *
 * @returns {*[]} Observable
 */
function getMainMenu() {
	let typeName = getTypeName();
	let filteredData = masterData.filter(e => (e[typeName] === true));
	dataMainMenu.set('data', filteredData);

	//dataMainMenu.set('data', masterData);
	return dataMainMenu;
}



//
///**
// * Add a single entry
// *
// * @param {object} data Data object
// * @param {string} data.name Section name
// * @param {string} data.id Section Id
// * @param {object} data.chapters Chapters object
// * @param {string} [data.chapters.name] Chapter name
// * @param {string} [data.chapters.id] Chapter Id
// * @param {boolean} [data.chapters.drugs] Chapter has drugs information
// * @param {boolean} [data.chapters.advice] Chapter has advice information
// */
//function add(data) {
//	console.log('Added data');
//	items.push(data);
//}

function getTypeName() {
	if (selectedIndex === 0) {
		return 'drugs';
	} else if (selectedIndex === 1) {
		return 'advice';
	}
}

//function setDataToCurrentType() {
//	let typeName = getTypeName();
//	let filteredData = masterData.filter(e => (e[typeName] === true));
//
//	filteredData.map(function (chapter) {
//		chapter.chapters = chapter.chapters.filter(e => (e[typeName] === true));
//		return chapter;
//	});
//
//	dataMainMenu.set('data', filteredData);
//}

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

	debug.saveFile('masterdata.json', JSON.stringify(data));

//	setDataToCurrentType();
}


function getSubmenu(pathId) {
	// todo, check that we're getting exactly one result back
	let data = masterData.filter(item => (item.id === pathId));
	dataSubmenu.set('data', data[0]);
	dataSubmenu.set('selectedIndex', selectedIndex);

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
