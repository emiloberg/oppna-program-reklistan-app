'use strict';

var frameModule = require('ui/frame');
var MainMenu = require('./../shared/models/MainMenu');



function navigateAway() {
	console.log('navigateAway');
	frameModule.topmost().navigate('third-page');
}
exports.navigateAway = navigateAway;





exports.pageLoaded = function( args ) {
	args.object.bindingContext = MainMenu.get();
};
