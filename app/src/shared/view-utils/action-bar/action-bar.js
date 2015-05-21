var frameModule = require('ui/frame');


function backTap() {
	let topmost = frameModule.topmost();
	topmost.goBack();
}


module.exports.backTap = backTap;
