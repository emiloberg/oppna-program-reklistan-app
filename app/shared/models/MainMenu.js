'use strict';

var observableModule = require('data/observable');
var observableArray = require('data/observable-array');

var MainMenuItems = new observableModule.Observable();
var items = new observableArray.ObservableArray();
MainMenuItems.set('menuItems', items);

/**
 * Create a new menu item
 * @constructor
 */
var MainMenuItem = (function () {
	function ViewModelItem(title) {
		this.title = title;
	}
	return ViewModelItem;
})();


/**
 * Get all main menu items
 *
 * @returns {*[]} Observable
 * @returns {string} Observable.title Title of the menu item
 */
function get() {
	return MainMenuItems;
}


/**
 * Clear and set a new main menu
 *
 * @param {MainMenuItem[]} data
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
module.exports.MainMenuItem = MainMenuItem;
