'use strict';

let frameModule = require('ui/frame');
var MainMenu = require('./../shared/models/MainMenu');

exports.pageLoaded = function( args ) {
	args.object.bindingContext = MainMenu.get();
};


function menuItemTap(args) {
	console.log('tapped');
	MainMenu.setSelected(args.view.bindingContext);
	frameModule.topmost().navigate('views/menu-sections');
}
exports.menuItemTap = menuItemTap;
