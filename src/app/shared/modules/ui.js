/*global UIColor */

'use strict';

let frameModule = require('ui/frame');
let applicationModule = require('application');

let customUi = {

	setViewDefaults: function() {
		var iosFrame = frameModule.topmost().ios;
		if (iosFrame) {
			iosFrame.navBarVisibility = 'never';
			iosFrame.controller.view.window.backgroundColor = UIColor.colorWithRedGreenBlueAlpha(0.945, 0.953, 0.953, 1);
		}
	}


};

export default customUi;
