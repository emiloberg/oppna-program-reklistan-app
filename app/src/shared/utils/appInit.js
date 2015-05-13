'use strict';

var dataSource = require('./dataSource');

function init() {
	return dataSource.init();
}

module.exports.init = init;

