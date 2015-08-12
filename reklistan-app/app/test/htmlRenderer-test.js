/*global xdescribe, beforeEach, it*/
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sharedUtilsHtmlRenderer = require('../shared/utils/htmlRenderer');

var _sharedUtilsHtmlRenderer2 = _interopRequireDefault(_sharedUtilsHtmlRenderer);

var _node_modulesChai = require('../../node_modules/chai');

xdescribe('htmlRenderer', function () {

	var htmlRenderer = undefined;

	beforeEach(function () {
		htmlRenderer = new _sharedUtilsHtmlRenderer2['default']();
	});

	it('should register and compile Template', function () {
		htmlRenderer.registerTemplate('name', 'templateContent');
	});

	it('should process templates correctly', function () {

		htmlRenderer.registerTemplate('name', '{{key}}');
		var result = htmlRenderer.processTemplate('name', {});
		(0, _node_modulesChai.expect)(result).to.equal('');

		result = htmlRenderer.processTemplate('name', { key: 'value' });
		(0, _node_modulesChai.expect)(result).to.equal('value');

		htmlRenderer.registerTemplate('name', '{{#each this}}{{p}}{{/each}}');
		result = htmlRenderer.processTemplate('name', [{ p: 1 }, { p: 2 }, { p: 3 }]);
		(0, _node_modulesChai.expect)(result).to.equal('123');
	});
});