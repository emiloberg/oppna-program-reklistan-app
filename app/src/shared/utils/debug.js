'use strict';
var eyes = require('./../../thirdparty/eyes');

function itemInspector(name, item) {
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


function inspect(something) {
	console.log(eyes.inspect(something));
}


module.exports.itemInspector = itemInspector;
module.exports.inspect = inspect;
