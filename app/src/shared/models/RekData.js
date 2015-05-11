'use strict';

let debug = require('./../utils/debug');
var observableModule = require('data/observable');
var observableArray = require('data/observable-array');




let masterData = [];

var RekData = new observableModule.Observable();
RekData.set('data', []);

let selectedIndex = 1;

RekData.set('selectedIndex', selectedIndex);

RekData.on(observableModule.Observable.propertyChangeEvent, function(propertyChangeData) {
	console.log(propertyChangeData.propertyName + " has been changed and the new value is: " + propertyChangeData.value);

	if (propertyChangeData.propertyName === 'selectedIndex') {
		setDataToCurrentType();
	}
});

/**
 * Get all RekData items
 *
 * @returns {*[]} Observable
 */
function get() {
	return RekData;
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
	if (RekData.get('selectedIndex') === 0) {
		return 'drugs';
	} else if (RekData.get('selectedIndex') === 1) {
		return 'advice';
	}
}

function setDataToCurrentType() {
	let typeName = getTypeName();
	let filteredData = masterData.filter(e => (e[typeName] === true));
	
	filteredData.map(function (chapter) {
		let filteredChapters = chapter.chapters.filter(e => (e[typeName] === true));
		chapter.chapters = filteredChapters;
		return chapter;
	});
	
	RekData.set('data', filteredData);
}

/**
 * Clear and set RekData
 *
 * @param {Object[]} data
 */
function set(data) {
	while (masterData.length > 0) {
		masterData.pop();
	}
	data.forEach(function (entry) {
		masterData.push(entry);
	});

	setDataToCurrentType();
}

function getFromPathId(pathId) {
	// todo, check that we're getting exactly one result back
	let ret = RekData.get('data').filter(item => (item.id === pathId));

	debug.inspect(ret);

	return ret[0];
}


module.exports.get = get;
module.exports.set = set;
module.exports.getFromPathId = getFromPathId;




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
