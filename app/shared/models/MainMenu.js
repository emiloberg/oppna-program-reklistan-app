var observableModule = require( "data/observable" );
var MainMenuItems = new observableModule.Observable();

MainMenuItems.set( "menuItems", []);

function get() {
	return MainMenuItems;
}

function set(data) {
	MainMenuItems.set( "menuItems", data);
}

module.exports.get = get;
module.exports.set = set;


