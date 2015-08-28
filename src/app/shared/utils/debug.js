'use strict';

import * as eyes from './../../thirdparty/eyes';
import * as fs from 'file-system';
import {Observable} from 'data/observable';
import {ObservableArray} from 'data/observable-array';

var DEBUG_LOG = new ObservableArray([]);
var DEBUG_OBJ = new Observable({
	log: DEBUG_LOG
});

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
	const currentdate = new Date();
	const time = '[' +
		(currentdate.getHours() < 10 ? '0' : '') + currentdate.getHours() + ':' +
		(currentdate.getMinutes() < 10 ? '0' : '') + currentdate.getMinutes() + ':' +
		(currentdate.getSeconds() < 10 ? '0' : '') + currentdate.getSeconds() +
		'] ';

	msg = time + msg;

	if (type === 'error') {
		msg = '## [ERROR] ' + msg;
	}

	console.log(msg);
	DEBUG_LOG.unshift(msg);
}

export function getDebugLog(){
	return DEBUG_OBJ;
}

export function clearDebugLog(){
	while(DEBUG_LOG.length > 0) {
		DEBUG_LOG.pop();
	}
}
