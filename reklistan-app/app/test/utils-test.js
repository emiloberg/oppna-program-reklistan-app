/*global describe, it*/
'use strict';

var _sharedUtilsUtils = require('../shared/utils/utils');

var _node_modulesChai = require('../../node_modules/chai');

describe('Utils', function () {
	it('should ASCII-normalize correctly', function () {
		var unicode = 'AꜲÆꜴꜶꜸꜼBCDǱǲEFGHIJKLǇǈMNǊǋOƢꝎȢPQRSTꜨUVꝠWXYZaꜳæꜵꜷꜹꜽbcdǳefghƕijklǉmnǌoƣȣꝏpqrstꜩuvꝡwxyz';
		var normalized = (0, _sharedUtilsUtils.makeUrlSafe)(unicode);
		var expected = 'AAAAEAOAUAVAYBCDDZDzEFGHIJKLLJLjMNNJNjOOIOOOUOEoePQRSTTZUVVYWXYZaaaaeaoauavaybcddzefghhvijklljmnnjooiouoopqrsttzuvvywxyz';
		(0, _node_modulesChai.expect)(normalized).to.equal(expected);
	});
});