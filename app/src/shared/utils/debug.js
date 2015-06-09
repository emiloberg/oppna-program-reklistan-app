'use strict';

var eyes = require('./../../thirdparty/eyes');
var fs = require('file-system');

export function inspect(something) {
	console.log(eyes.inspect(something));
	return something;
}


export function saveFile(filename, content) {
	var root = '/tmp/';
	var path = fs.path.join(root, filename);
	var file = fs.File.fromPath(path);

	file.writeText(content).then(function () {

	}, function () {
		throw new Error('Could not write file!');
	});
}

export function debug(msg, type = 'info') {
	if (type === 'error') {
		console.log('######################## [ERROR] ' + msg);
	} else {
		console.log(msg);
	}
}
