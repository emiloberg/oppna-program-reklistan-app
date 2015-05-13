'use strict';
var eyes = require('./../../thirdparty/eyes');
var fs = require("file-system");


export function itemInspector(name, item) {
	console.log('inspecting ' + name + ' started');
	if (item == null) {
		console.log(name + ' is null');
		return;
	}
	var arrKeys = [];
	for (var p in item) {
		arrKeys.push(p);
	}


	console.log(arrKeys.join('\n'));
	console.log('inspecting ' + name + ' finished');
}


export function inspect(something) {
	console.log(eyes.inspect(something));
}


export function saveFile(filename, content) {
	var root = '/tmp/';
	var path = fs.path.join(root, filename);
	var file = fs.File.fromPath(path);

	file.writeText(content).then(function () {

	}, function (error) {
		throw new Error('Could not write file!')
	});
}

//module.exports.itemInspector = itemInspector;
//module.exports.inspect = inspect;
//module.exports.saveFile = saveFile;

