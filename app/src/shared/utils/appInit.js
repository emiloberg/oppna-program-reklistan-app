'use strict';

var dataSource = require('./dataSource');

function init() {
	console.log("HEJ");
	dataSource.get();
}

module.exports.init = init;
  