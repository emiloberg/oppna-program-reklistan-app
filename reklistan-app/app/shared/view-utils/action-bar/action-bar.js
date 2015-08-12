'use strict';

var frameModule = require('ui/frame');

function backTap() {
	var topmost = frameModule.topmost();
	topmost.goBack();
}

module.exports.backTap = backTap;