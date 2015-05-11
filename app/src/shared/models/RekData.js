'use strict';

let debug = require('./../utils/debug');

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

var observableModule = require('data/observable');
var observableArray = require('data/observable-array');

var RekData = new observableModule.Observable();
var items = new observableArray.ObservableArray();
RekData.set('data', items);


/**
 * Get all RekData items
 *
 * @returns {*[]} Observable
 */
function get() {
	return RekData;
}


/**
 * Add a single entry
 *
 * @param {object} data Data object
 * @param {string} data.name Section name
 * @param {string} data.id Section Id
 * @param {object} data.chapters Chapters object
 * @param {string} [data.chapters.name] Chapter name
 * @param {string} [data.chapters.id] Chapter Id
 * @param {boolean} [data.chapters.drugs] Chapter has drugs information
 * @param {boolean} [data.chapters.advice] Chapter has advice information
 */
function add(data) {
	console.log('Added data');
	items.push(data);
}


/**
 * Clear and set RekData
 *
 * @param {Object[]} data
 */
function set(data) {
	while (items.length > 0) {
		items.pop();
	}
	data.forEach(function (entry) {
		items.push(entry);
	});

}

function getFromPathId(pathId) {
	// todo, check that we're getting exactly one result back
	let ret = items.filter(item => (item.id === pathId));
	return ret[0];
}


module.exports.get = get;
module.exports.set = set;
module.exports.add = add;
module.exports.getFromPathId = getFromPathId;
