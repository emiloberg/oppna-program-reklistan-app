'use strict';


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
RekData.set('menuItems', items);

/**
 * Get all RekData items
 *
 * @returns {*[]} Observable
 */
function get() {
	return RekData;
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


module.exports.get = get;
module.exports.set = set;
