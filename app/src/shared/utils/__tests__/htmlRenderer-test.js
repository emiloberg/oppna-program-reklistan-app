
jest.dontMock('../htmlRenderer');

var HtmlRenderer = require('../htmlRenderer');

describe('htmlRenderer', function() {

	it('should register Template', function() {
		var renderer = HtmlRenderer();
		renderer.registerTemplate('name', '{{property}}');

		expect(function() {
			//renderer.registerTemplate();
		}).toThrow();
	});
});