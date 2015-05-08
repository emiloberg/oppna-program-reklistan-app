'use strict';

var observableModule = require('data/observable');
var observableArray = require('data/observable-array');

var DrugsItems = new observableModule.Observable();
var items = new observableArray.ObservableArray();
DrugsItems.set('drugsItems', items);


/**
 * Create a new menu item
 * @constructor
 */
var DrugsItem = (function () {
	function ViewModelItem(title, uuid, sections) {
		this.title = title;
		this.uuid = uuid;
		this.sections = sections;
	}
	return ViewModelItem;
})();


/**
 * Get all Drugs
 *
 * @returns {*[]} Observable
 * @returns {string} Observable.title
 */
function get() {
	return DrugsItems;
}


/**
 * Clear and set a new main menu
 *
 * @param {DrugsItem[]} data
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
module.exports.DrugsItem = DrugsItem;

