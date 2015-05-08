'use strict';

var observableModule = require('data/observable');
var observableArray = require('data/observable-array');

var MainMenu = new observableModule.Observable();
var items = new observableArray.ObservableArray();
MainMenu.set('menuItems', items);


var selectedItem;

function setSelected(selected) {
	//console.log('SELECTED');
	//console.log(JSON.stringify(selected));
	//MainMenu.set('selected', selected);
	//
	selectedItem = selected;
}

function getSelected() {
	return selectedItem;
	//
	//console.log('-----');
	//
	//
	//var temp = MainMenu.get('selected');
	//Object.keys(temp).forEach(function (key) {
	//	console.log(key + ': ' + temp[key]);
	//});
	//
	//console.log('-----');
	//
	//return MainMenu.get('selected');
}

/**
 * Get all main menu items
 *
 * @returns {*[]} Observable
 */
function get() {
	return MainMenu;
}


/**
 * Clear and set a new main menu
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
module.exports.setSelected = setSelected;
module.exports.getSelected = getSelected;
