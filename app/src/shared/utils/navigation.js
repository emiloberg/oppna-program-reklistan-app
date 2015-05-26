'use strict';

const gestures = require('ui/gestures');
const frameModule = require('ui/frame');

const navigation = {
	swipe(args) {
		if (args.direction === gestures.SwipeDirection.right) {
			frameModule.topmost().goBack();
		}
	},

	back() {
		frameModule.topmost().goBack();
	}

};

export default navigation;
