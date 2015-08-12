/*global describe, it */
'use strict';

//console.dir(require);

//import navigation from './../shared/utils/navigation';

var _node_modulesChai = require('../../node_modules/chai');

describe('navigateToUrl', function () {
	it('should parse url', function () {
		var normalized = 1;
		var expected = 1;
		(0, _node_modulesChai.expect)(normalized).to.equal(expected);
	});
});