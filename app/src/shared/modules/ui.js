'use strict';

let frameModule = require('ui/frame');

let ui = {
	topbar: {
		setText: function(page, text) {
			// TODO, Implement for Android
			let frameModule = require('ui/frame');
			if (page.ios) {
				// Change the UIViewController's title property
				page.ios.title = text;

				// Get access to the native iOS UINavigationController
				let controller = frameModule.topmost().ios.controller;

				// Call the UINavigationController's setNavigationBarHidden method
				controller.navigationBarHidden = false;
			}
		}
	},

	removeIOSNavBar: function() {
		var iosFrame = frameModule.topmost().ios;
		if (iosFrame) {
			iosFrame.navBarVisibility = 'never';
		}
	},

	viewSettings: {
		setDefaults: function() {
			ui.removeIOSNavBar();
		}
	}

};

module.exports = ui;
